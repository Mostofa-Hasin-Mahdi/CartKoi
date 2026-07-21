import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cartId } = await params;

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch Cart details for cache check
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id, name, ai_summary, last_summarized_review_count")
      .eq("id", cartId)
      .single();

    if (cartError || !cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // 2. Fetch all reviews to check count and get data for summary
    const { data: reviews, error: reviewError } = await supabase
      .from("reviews")
      .select("rating, comment")
      .eq("cart_id", cartId)
      .not("comment", "is", null) // Only get reviews with text
      .order("created_at", { ascending: false });

    if (reviewError) {
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    const currentReviewCount = reviews?.length || 0;
    const lastSummarizedCount = cart.last_summarized_review_count || 0;

    // 3. Cache Evaluation: Return cached summary if less than 2 new text reviews were added
    if (cart.ai_summary && currentReviewCount < lastSummarizedCount + 2) {
      return NextResponse.json({ summary: cart.ai_summary });
    }

    // Not enough text reviews to make a meaningful summary
    if (currentReviewCount < 2) {
      return NextResponse.json({ summary: null });
    }

    // 4. Prepare reviews for AI: 5 Good, 5 Medium, 5 Bad
    const goodReviews = reviews.filter(r => r.rating >= 4).slice(0, 5);
    const mediumReviews = reviews.filter(r => r.rating === 3).slice(0, 5);
    const badReviews = reviews.filter(r => r.rating <= 2).slice(0, 5);

    const selectedReviews = [...goodReviews, ...mediumReviews, ...badReviews];

    if (selectedReviews.length === 0) {
      return NextResponse.json({ summary: null });
    }

    const reviewText = selectedReviews
      .map(r => `Rating: ${r.rating}/5 - Comment: "${r.comment}"`)
      .join("\n");

    const systemPrompt = `You are an enthusiastic but trustworthy food critic. 
Write a very brief and concise review summary (1 short paragraph maximum, no more than 3-4 sentences) highlighting the pros and cons of the food cart based on the provided customer reviews. 
Avoid sounding overly cringey or fake; keep it natural, balanced, and helpful for a potential customer.
Do not mention the specific star ratings in the text, focus on the qualitative feedback.`;

    // 5. Call Mistral AI
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!mistralKey) {
      return NextResponse.json({ error: "Mistral API key not configured" }, { status: 500 });
    }

    const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here are the reviews for ${cart.name}:\n\n${reviewText}` }
        ]
      }),
    });

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.text();
      console.error("Mistral API Error:", errorData);
      return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 });
    }

    const mistralData = await mistralResponse.json();
    const generatedSummary = mistralData.choices[0]?.message?.content;

    if (!generatedSummary) {
      return NextResponse.json({ error: "Received empty summary from AI" }, { status: 500 });
    }

    // 6. Update Cache in Database
    // Note: We need a service role key to bypass RLS if anon users can't update carts.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
      );
      
      const { error: updateError } = await supabaseAdmin
        .from("carts")
        .update({
          ai_summary: generatedSummary,
          last_summarized_review_count: currentReviewCount
        })
        .eq("id", cartId);
        
      if (updateError) {
        console.warn("Failed to update cache in carts table:", updateError);
      }
    } else {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not found. AI summary will not be cached.");
    }

    return NextResponse.json({ summary: generatedSummary });

  } catch (error) {
    console.error("Error in AI Summary Route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
