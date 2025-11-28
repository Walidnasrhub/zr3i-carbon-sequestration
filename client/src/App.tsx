import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Farmers from "./pages/Farmers";
import Investors from "./pages/Investors";
import Partners from "./pages/Partners";
import Enterprise from "./pages/Enterprise";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/farmers"} component={Farmers} />
      <Route path={"/investors"} component={Investors} />
      <Route path={"/partners"} component={Partners} />
      <Route path={"/enterprise"} component={Enterprise} />
      <Route path={"/about"} component={About} />
      <Route path={"/register"} component={Register} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
