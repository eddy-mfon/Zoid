import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useLayoutEffect, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import { ShopProvider } from "./contexts/ShopContext";
import { AuthProvider } from "./contexts/AuthContext";
import AuthModal from "./components/AuthModal";
import Archives from "./pages/Archives";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

// Disable browser auto scroll restoration so route transitions always start at top (0, 0)
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function ScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/collection"} component={Collection} />
        <Route path={"/product/:slug"} component={ProductDetail} />
        <Route path={"/checkout"} component={Checkout} />
        <Route path={"/archives"} component={Archives} />
        <Route path={"/about"} component={About} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/profile"} component={Profile} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AuthProvider>
            <ShopProvider>
              <AuthModal />
              <Router />
            </ShopProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
