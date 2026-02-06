import { Link } from "wouter";
import { CyberCard } from "@/components/CyberCard";
import { AlertTriangle } from "lucide-react";
import { CyberButton } from "@/components/CyberButton";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <CyberCard className="w-full max-w-md text-center py-12 border-destructive/50">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Signal Lost. Coordinates Invalid.</p>

        <Link href="/">
          <CyberButton variant="outline" className="w-full">
            Return to Base
          </CyberButton>
        </Link>
      </CyberCard>
    </div>
  );
}
