import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import OwnerCTA from "@/components/OwnerCTA";
import TopBar from "@/components/TopBar";

export default function Home() {
  return (
    // main wrapper for the landing page
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 
        TopBar shows Location and Username 
      */}
      <TopBar />

      {/* 
        We render the NavBar which is fixed to the bottom dock.
      */}
      <NavBar />
      
      {/* Landing page sections */}
      <Hero />
      <OwnerCTA />
    </main>
  );
}
