import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, School, Recycle, Lightbulb, Utensils, Heart, Paintbrush, Leaf } from "lucide-react";

const CommunityImpactProjects = () => {
  const cipProjects = [
    {
      icon: Droplets,
      title: "Water Access Projects",
      description: "Refurbishing boreholes and installing hand-pumps",
      examples: ["Borehole rehabilitation", "Well cleaning", "Hand-pump installation"]
    },
    {
      icon: School,
      title: "School Support",
      description: "Upgrading educational facilities and resources",
      examples: ["Classroom painting", "Desk donations", "Solar lamps installation"]
    },
    {
      icon: Recycle,
      title: "Environmental Projects",
      description: "Community clean-up and recycling initiatives",
      examples: ["Waste collection drives", "Plastic recycling", "Community gardens"]
    },
    {
      icon: Lightbulb,
      title: "Safety & Infrastructure",
      description: "Installing solar streetlights for community safety",
      examples: ["Solar streetlights", "Market lighting", "School security lights"]
    },
    {
      icon: Utensils,
      title: "Food Security",
      description: "Supporting vulnerable families and communities",
      examples: ["Community gardens", "Food banks", "Urban farming"]
    },
    {
      icon: Heart,
      title: "Healthcare Support",
      description: "Health awareness and sanitation drives",
      examples: ["Malaria awareness", "Handwashing points", "Health screenings"]
    },
    {
      icon: Paintbrush,
      title: "Community Arts",
      description: "Inspirational murals and public art projects",
      examples: ["Renewed Hope murals", "School wall art", "Community centers"]
    },
    {
      icon: Leaf,
      title: "Green Football Pitches",
      description: "Rehabilitating local football fields",
      examples: ["Pitch markings", "Goalposts repair", "Seating installation"]
    }
  ];

  return (
    <section className="px-4 py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Community Impact Projects (CIP)
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Every team must score for their community - ₦1.5M support for qualifying teams
          </p>
          <div className="bg-primary/10 rounded-lg p-4 inline-block">
            <p className="font-semibold text-primary">
              "Every Team Must Score for Their Community"
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {cipProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card key={index} className="transition-transform hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-2">
                    <div className="rounded-full bg-primary/10 p-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-center">{project.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    {project.description}
                  </p>
                  <ul className="text-xs space-y-1">
                    {project.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center text-muted-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            How CIP Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold mb-2">Complete Project</h4>
              <p className="text-muted-foreground">Each qualifying team must complete 1 CIP before advancing</p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold mb-2">Document Impact</h4>
              <p className="text-muted-foreground">Projects documented with photos, videos, and GPS mapping</p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold mb-2">Digital Tracking</h4>
              <p className="text-muted-foreground">Uploaded to Renewed Hope App with social media visibility</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpactProjects;