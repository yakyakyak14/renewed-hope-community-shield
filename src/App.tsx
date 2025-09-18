import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NigerianWavesBackground from "@/components/WaveBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Site-wide interactive Nigerian waves background */}
      <NigerianWavesBackground
        waveColors={["#008751", "#FFFFFF", "#228B22"]}
        backgroundColor="#F9F9F9"
        mouseInteraction
        animationSpeed="medium"
        amplitude={80}
        frequency={0.012}
        opacity={[0.85, 0.65, 0.45]}
        gradients
        clickRipples
        responsiveBreakpoints
      />
      <div className="relative z-10">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
