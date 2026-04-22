import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    // main wrapper for the landing page
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 
        We render the NavBar which is fixed to the top.
        Then we render the Hero section below it. 
      */}
      <NavBar />
      <Hero />
      
      {/* 
        Phase 3 components (Features, OwnerCTA) will go here soon! 
      */}
    </main>
  );
}
