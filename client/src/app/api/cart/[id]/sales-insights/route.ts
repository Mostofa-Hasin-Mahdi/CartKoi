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

    // Fetch Cart details for cache check
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id, name, ai_sales_insight")
      .eq("id", cartId)
      .single();

    if (cartError || !cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Since we are forcing regeneration when this endpoint is hit, we won't strictly use the cache here, 
    // unless we wanted to check a timestamp. But the prompt says "regenerate", so we will bypass cache on GET/POST.
    // If they just want to view the cached insight without regenerating, they will read it directly from the carts table on the client.
    // So this route purely generates a NEW insight and caches it.

    // Fetch all sales logs for this cart
    const { data: sales, error: salesError } = await supabase
      .from("sales_logs")
      .select("amount, location_name, lat, lng, created_at")
      .eq("cart_id", cartId)
      .order("created_at", { ascending: false });

    if (salesError) {
      return NextResponse.json({ error: "Failed to fetch sales logs" }, { status: 500 });
    }

    if (!sales || sales.length === 0) {
      return NextResponse.json({ summary: "No sales data available to analyze yet." });
    }

    // Format the data for the AI
    const formattedSales = sales.map(s => {
      const dateObj = new Date(s.created_at);
      const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `Location: ${s.location_name} (Lat: ${s.lat}, Lng: ${s.lng}) - Revenue: ৳${s.amount} - Time: ${day}, ${time}`;
    }).join("\n");

    const systemPrompt = `You are a business analyst. Analyze this sales data for a food cart.
Look at the coordinates, location names, and timestamps.
Return a structured JSON object exactly matching this schema:
{
  "top_location": { "name": string, "revenue": string },
  "secondary_location": { "name": string, "revenue": string },
  "weakest_location": { "name": string, "revenue": string },
  "best_time": string,
  "recommendation": string
}
Do not include any markdown formatting or extra text outside the JSON object.`;

    // Call Mistral AI
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
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the sales data for ${cart.name}:\n\n${formattedSales}` }
        ]
      }),
    });

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.text();
      console.error("Mistral API Error:", errorData);
      return NextResponse.json({ error: "Failed to generate AI insight" }, { status: 500 });
    }

    const mistralData = await mistralResponse.json();
    const generatedInsight = mistralData.choices[0]?.message?.content;

    if (!generatedInsight) {
      return NextResponse.json({ error: "Received empty insight from AI" }, { status: 500 });
    }

    // Update Cache in Database
    // Using service role key to bypass RLS for server-side update, or falling back to standard client if RLS allows.
    // In this case, since the owner initiates this, standard client *might* work if RLS allows owner to update cart.
    // But we'll try service_role if available.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
      );
      await supabaseAdmin.from("carts").update({ ai_sales_insight: generatedInsight }).eq("id", cartId);
    } else {
      // Try with user's context (this works if carts table RLS allows owners to UPDATE)
      await supabase.from("carts").update({ ai_sales_insight: generatedInsight }).eq("id", cartId);
    }

    return NextResponse.json({ insight: generatedInsight });

  } catch (error) {
    console.error("Error in AI Sales Insights Route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
