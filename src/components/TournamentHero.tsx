import { Button } from "@/components/ui/button";
import { Trophy, Users, Target } from "lucide-react";

const TournamentHero = () => {
  return (
    <section className="safe-area-top px-4 py-16 text-center">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Trophy className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
          THE RENEWED HOPE<br />
          <span className="text-primary">COMMUNITY SHIELD</span>
        </h1>
        
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Nigeria's Premier Community Football Tournament - Building Unity Through Football
        </p>
        
        {/* Prize Pool Section */}
        <div className="mb-8 rounded-lg bg-primary/10 p-6">
          <h2 className="mb-4 text-2xl font-bold text-primary">Prize Pool</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">₦25M</div>
              <div className="text-sm font-semibold">1st Place - Gold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">₦15M</div>
              <div className="text-sm font-semibold">2nd Place - Silver</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">₦10M</div>
              <div className="text-sm font-semibold">3rd Place - Bronze</div>
            </div>
          </div>
        </div>
        
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 shadow-lg">
            <Users className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Community Unity</h3>
            <p className="text-sm text-muted-foreground">Bringing communities together through football</p>
          </div>
          
          <div className="rounded-lg bg-card p-6 shadow-lg">
            <Target className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Grassroots Development</h3>
            <p className="text-sm text-muted-foreground">Discovering and developing grassroots football talent</p>
          </div>
          
          <div className="rounded-lg bg-card p-6 shadow-lg">
            <Trophy className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 font-semibold">Community Impact</h3>
            <p className="text-sm text-muted-foreground">Every team must score for their community</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="text-lg">
            Register Now
          </Button>
          <Button variant="outline" size="lg" className="text-lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TournamentHero;