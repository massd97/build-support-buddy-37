import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Index from "@/pages/Index";

const queryClient = new QueryClient();

const NormalizePathRedirect = () => {//こちらがないとパスが異なり、エラーの原因となります（ページが真っ白）
  const location = useLocation();

  if (location.pathname.startsWith("/userCodeAppPanel")) {
    console.log("Redirecting to normalized path");
    return <Navigate to="/" replace />;
  }else{
    console.log("No need to redirect");
  }

  return null; // No redirect needed
};

const LocationLogger = () => {
  const location = useLocation();
  console.log("Current path:", location.pathname);
  return null; // This component doesn't render anything
};

const App = () => {

  console.log(`App rendered`);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <NormalizePathRedirect /> {/* こちらがないとパスが異なり、エラーの原因となります（ページが真っ白） */}
          <LocationLogger /> {/* Log location here */}
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
