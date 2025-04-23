import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Assessment from "@/pages/Assessment";
import Results from "@/pages/Results";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/assessment" component={Assessment} />
            <Route path="/results/:id?" component={Results} />
            <Route path="/history" component={History} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
