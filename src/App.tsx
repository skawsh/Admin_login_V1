
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Studios from "./pages/Studios";
import AddStudio from "./pages/AddStudio";
import StudioDetails from "./pages/StudioDetails";
import StudioServices from "./pages/StudioServices";
import StudioRatings from "./pages/StudioRatings";
import Services from "./pages/Services";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Analytics from "./pages/Analytics";
import Revenue from "./pages/Revenue";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import OnboardRequests from "./pages/OnboardRequests";
import Login from "./pages/Login";
import { PrivateRoute } from "./components/login/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/studios/add" element={<AddStudio />} />
            <Route path="/studios/:id" element={<StudioDetails />} />
            <Route path="/studios/:id/services" element={<StudioServices />} />
            <Route path="/studios/:id/ratings" element={<StudioRatings />} />
            <Route path="/studios/onboard-requests" element={<OnboardRequests />} />
            <Route path="/services" element={<Services />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId/details" element={<OrderDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/users" element={<Users />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
