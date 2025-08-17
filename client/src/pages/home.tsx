import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Metadata from "@/components/metadata";
import { Sparkles, CreditCard, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Metadata 
        title="Delula - Coinbase CDP Integration Demo" 
        description="React TypeScript frontend demonstrating Coinbase CDP integration" 
        keywords="coinbase, cdp, crypto, payments, react, typescript" 
      />
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            Coinbase CDP Integration
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A modern React TypeScript frontend demonstrating Coinbase Developer Platform integration concepts
          </p>
          <Badge className="bg-accent-blue/20 text-accent-blue text-lg px-4 py-2">
            Demo Application
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="bg-card-bg border-border-primary">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-accent-blue mb-2" />
              <CardTitle className="text-white">Dynamic Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Seamless Coinbase OAuth integration for wallet connection and user authentication.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-primary">
            <CardHeader>
              <CreditCard className="w-8 h-8 text-accent-green mb-2" />
              <CardTitle className="text-white">CDP Onramp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Coinbase Developer Platform onramp functionality for crypto payments.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-primary">
            <CardHeader>
              <Zap className="w-8 h-8 text-accent-purple mb-2" />
              <CardTitle className="text-white">Modern Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Built with TypeScript, Vite, Tailwind CSS, and shadcn/ui components.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="flex justify-center gap-6 mb-8">
            <Button className="bg-accent-blue hover:bg-accent-blue/90">
              Get Started
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}