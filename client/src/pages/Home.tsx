import { Link } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { Crosshair, Trophy, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-md w-full space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-2"
        >
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-purple-600 text-shadow-neon filter drop-shadow-lg">
            AR<br/>HUNT
          </h1>
          <p className="text-xl text-muted-foreground font-display tracking-[0.2em] uppercase">
            Augmented Reality Shooter
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6 flex flex-col items-center"
        >
          <Link href="/game" className="w-full">
            <CyberButton size="lg" className="w-full text-xl py-8 box-shadow-neon group">
              <Crosshair className="mr-3 w-6 h-6 group-hover:rotate-90 transition-transform" />
              Start Mission
            </CyberButton>
          </Link>

          <Link href="/leaderboard" className="w-full">
            <CyberButton variant="secondary" size="lg" className="w-full">
              <Trophy className="mr-3 w-6 h-6" />
              Leaderboard
            </CyberButton>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground flex items-center justify-center gap-2 border border-border p-3 bg-background/50 backdrop-blur-sm"
        >
          <Info className="w-4 h-4 text-primary" />
          <span>Camera access required. Find the Hiro marker to play.</span>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-10 w-32 h-32 border-l-2 border-t-2 border-primary/30 opacity-50" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-r-2 border-b-2 border-secondary/30 opacity-50" />
    </div>
  );
}
