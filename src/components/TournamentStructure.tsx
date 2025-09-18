import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";

const TournamentStructure = () => {
  const tournaments = [
    {
      title: "Local Government Eliminations",
      location: "All 774 LGAs, Nigeria",
      date: "December 2025 - January 2026",
      participants: "1000+ Teams",
      prize: "Qualification to State Level",
      status: "Registration Open"
    },
    {
      title: "State Eliminations",
      location: "36 States + FCT", 
      date: "February 2026",
      participants: "37 Teams",
      prize: "Qualification to Zonal Level",
      status: "Coming Soon"
    },
    {
      title: "Zonal Eliminations",
      location: "6 Geopolitical Zones",
      date: "March 2026", 
      participants: "6 Teams",
      prize: "Qualification to National Finals",
      status: "Coming Soon"
    },
    {
      title: "National Finals",
      location: "Abuja, Nigeria",
      date: "April - May 2026", 
      participants: "Final 6 Teams",
      prize: "₦50,000,000 Total Prize Pool",
      status: "Grand Finale"
    }
  ];

  return (
    <section className="px-4 py-16">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Tournament Structure</h2>
          <p className="text-lg text-muted-foreground">
            National grassroots football championship across all 774 LGAs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tournaments.map((tournament, index) => (
            <Card key={index} className="overflow-hidden transition-transform hover:scale-105">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tournament.title}</CardTitle>
                  <Badge variant={tournament.status === "Registration Open" ? "default" : "secondary"}>
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {tournament.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {tournament.date}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {tournament.participants}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Trophy className="h-4 w-4" />
                    {tournament.prize}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TournamentStructure;