import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import AlphaHome from "@/pages/alpha-home";
import AlphaCredits from "@/pages/alpha-credits";
import Account from "@/pages/account";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import PaymentSuccess from "@/pages/payment-success";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  // Use build-time environment variable for deployment type
  const deploymentType = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE;
  const isAlphaSite = deploymentType === 'alpha';

  if (isAlphaSite) {
    // Alpha site routes - guest functionality + admin
    return (
              <DynamicContextProvider
          settings={{
            environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "a284fa4e-4039-430c-8dd3-190e8313c12f",
          }}
        >
        <Switch>
          <Route path="/" component={AlphaHome} />
          <Route path="/alpha" component={AlphaHome} />
          <Route path="/alpha/my-makes" component={AlphaMyMakes} />
          <Route path="/alpha/m/:shortId" component={AlphaAssetViewer} />
          <Route path="/alpha/credits" component={AlphaCredits} />
          <Route path="/alpha/account" component={Account} />
          <Route path="/alpha/payment/success" component={PaymentSuccess} />
          <Route path="/alpha/thumbnail-test" component={ThumbnailTest} />
          <Route path="/alpha/kling-test" component={KlingTest} />

          {/* Admin routes - available in alpha mode */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/recipe-tag-icons" component={AdminRecipeTagIcons} />
          <Route path="/admin/backlog-maintenance" component={AdminBacklogMaintenance} />

          {/* Media Library available in alpha site */}
          <Route path="/library" component={MediaLibrary} />
          
          {/* Upload Demo available in alpha site */}
          <Route path="/upload-demo" component={UploadDemoPage} />

          <Route>
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/alpha" className="text-accent-blue hover:underline">
                  Return to Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </DynamicContextProvider>
    );
  }

  // Production site routes - full functionality
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/my-gallery" component={MyGallery} />
      <Route path="/queue" component={Queue} />
      {/* <Route path="/profile" component={Profile} /> */}
      <Route path="/account" component={Account} />
      <Route path="/create-recipe" component={CreateRecipe} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/library" component={MediaLibrary} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/recipe/:slug" component={RecipeDetail} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/asset-viewer/:id" component={AssetViewer} />
      <Route path="/kling-test" component={KlingTest} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/recipe-tag-icons" component={AdminRecipeTagIcons} />
      <Route path="/admin/backlog-maintenance" component={AdminBacklogMaintenance} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Use build-time environment variable for deployment type
  const deploymentType = import.meta.env.VITE_SITE_DEPLOYMENT_TYPE;
  const isAlphaSite = deploymentType === 'alpha';

  // Use React Router's location hook to get current path
  const [location] = useLocation();
  const isMyMakesPage = location.includes('/alpha/my-makes');
  const isAssetViewerPage = location.includes('/alpha/m/');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen text-white font-inter relative">
          {/* Background Layers */}
          <div className="site-background"></div>
          <div className={
            isAlphaSite && isMyMakesPage ? "tiled-background-purple" :
              isAlphaSite && isAssetViewerPage ? "tiled-background-green" :
                "tiled-background"
          }></div>
          <div className={
            isAlphaSite && isMyMakesPage ? "gradient-overlay-purple" :
              isAlphaSite && isAssetViewerPage ? "gradient-overlay-green" :
                "gradient-overlay"
          }></div>

          {/* Content Layer */}
          <div className="relative z-10">
            <Toaster />
            <AppRoutes />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
