import HeroSection from "@/components/vox/hero/HeroSection";
import FeatureCards from "@/components/vox/features/FeatureCards";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeatureCards />
      </main>
    </div>
  );
}
