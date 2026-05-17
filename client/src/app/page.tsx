import Hero from "@/components/Hero";
import OwnerCTA from "@/components/OwnerCTA";

export default function Home() {
  return (
    // main wrapper for the landing page
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Landing page sections */}
      <Hero />
      <OwnerCTA />
    </main>
  );
}
