import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Award, Globe } from "lucide-react";

const CommunityImpact = () => {
  const impacts = [
    {
      icon: Heart,
      title: "Unity Building",
      description: "Fostering peace and unity across diverse Nigerian communities through sports",
      stats: "500+ Communities"
    },
    {
      icon: Star,
      title: "Talent Development", 
      description: "Discovering and nurturing grassroots sports talents nationwide",
      stats: "1000+ Athletes"
    },
    {
      icon: Award,
      title: "Leadership Skills",
      description: "Developing leadership capabilities and teamwork among youth",
      stats: "200+ Leaders"
    },
    {
      icon: Globe,
      title: "National Reach",
      description: "Connecting communities across all 36 states and FCT",
      stats: "36 States"
    }
  ];

  return (
    <section className="px-4 py-16 safe-area-bottom">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Community Impact</h2>
          <p className="text-lg text-muted-foreground">
            Building a stronger Nigeria through sports and community engagement
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {impacts.map((impact, index) => {
            const IconComponent = impact.icon;
            return (
              <Card key={index} className="text-center transition-transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="mb-2 text-lg font-semibold">{impact.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{impact.description}</p>
                  <div className="text-xl font-bold text-primary">{impact.stats}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 rounded-lg bg-primary/5 p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-foreground">
            Join the Movement
          </h3>
          <p className="mb-6 text-muted-foreground">
            Be part of Nigeria's largest community sports initiative. Together, we build hope, 
            unity, and a brighter future through the power of sports.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₦10M+</div>
              <div className="text-sm text-muted-foreground">Total Prize Money</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpact;