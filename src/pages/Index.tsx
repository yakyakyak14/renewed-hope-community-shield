import TournamentHero from "@/components/TournamentHero";
import RegistrationForm from "@/components/RegistrationForm";
import TournamentStructure from "@/components/TournamentStructure";
import CommunityImpact from "@/components/CommunityImpact";
import CommunityImpactProjects from "@/components/CommunityImpactProjects";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        <TournamentHero />
        <TournamentStructure />
        <CommunityImpactProjects />
        <RegistrationForm />
        <CommunityImpact />
      </div>
    </div>
  );
};

export default Index;
