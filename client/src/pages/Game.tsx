import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { useCreateScore } from "@/hooks/use-scores";
import { ArrowLeft, Target, Skull, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Game() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 second game
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState("");
  const monsterRef = useRef<any>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createScore = useCreateScore();

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // Clean up AR scene on unmount
  useEffect(() => {
    // Add specific styles to body when game mounts
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";

    return () => {
      // Restore body styles
      document.body.style.overflow = "";
      document.body.style.margin = "";
      // Reload page to clear AR.js camera stream properly as it tends to stick
      window.location.reload();
    };
  }, []);

  const handleFire = () => {
    if (gameOver) return;

    const monster = document.getElementById("monster");
    
    if (monster) {
      // Simple "hit" logic - in a real game we'd check raycaster intersection
      // But for this simple demo, firing "hits" if the monster is visible
      const isVisible = monster.getAttribute("visible") !== "false";
      
      if (isVisible) {
        monster.setAttribute("visible", "false");
        setScore((prev) => prev + 100);
        
        // Visual feedback
        toast({
          title: "HIT!",
          description: "+100 Points",
          className: "bg-primary text-white border-none font-display text-center",
          duration: 1000,
        });

        // Respawn logic
        setTimeout(() => {
          if (!gameOver) {
            // Random position for respawn
            const x = (Math.random() - 0.5) * 3;
            const y = (Math.random() * 0.5) + 0.5;
            const z = -3 + (Math.random() - 0.5) * 2;
            monster.setAttribute("position", `${x} ${y} ${z}`);
            monster.setAttribute("visible", "true");
            
            // Animation for respawn
            monster.setAttribute("animation", "property: scale; from: 0 0 0; to: 0.5 0.5 0.5; dur: 500; easing: easeOutElastic");
          }
        }, 2000);
      } else {
        // Miss feedback
        toast({
          title: "MISS",
          description: "Target not in sight!",
          variant: "destructive",
          duration: 500,
        });
      }
    }
  };

  const handleSubmitScore = async () => {
    if (!username.trim()) return;
    
    try {
      await createScore.mutateAsync({
        username,
        score,
      });
      setLocation("/leaderboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit score",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* AR Scene */}
      <div className="fixed inset-0 z-0">
        <a-scene embedded arjs='sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3; debugUIEnabled: false;'>
          {/* Lighting */}
          <a-entity light="type: ambient; color: #BBB"></a-entity>
          <a-entity light="type: directional; color: #FFF; intensity: 0.6" position="-0.5 1 1"></a-entity>

          {/* The Monster */}
          <a-box 
            id="monster" 
            position="0 0.5 -3" 
            rotation="0 45 0" 
            color="#FF0080" 
            scale="0.5 0.5 0.5"
            animation="property: rotation; to: 0 405 0; loop: true; dur: 5000; easing: linear"
            material="opacity: 0.9; metalness: 0.5; roughness: 0.2"
          >
             {/* Simple eyes for the box monster */}
            <a-sphere position="0.2 0.2 0.5" radius="0.05" color="white"></a-sphere>
            <a-sphere position="-0.2 0.2 0.5" radius="0.05" color="white"></a-sphere>
            <a-sphere position="0.2 0.2 0.54" radius="0.02" color="black"></a-sphere>
            <a-sphere position="-0.2 0.2 0.54" radius="0.02" color="black"></a-sphere>
          </a-box>

          <a-marker-camera preset='hiro'></a-marker-camera>
        </a-scene>
      </div>

      {/* Game UI Overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 safe-area-inset">
        
        {/* Top HUD */}
        <div className="flex justify-between items-start pointer-events-auto">
          <Link href="/">
            <button className="bg-black/50 backdrop-blur-md p-2 border border-white/20 text-white rounded hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          
          <div className="flex flex-col items-end gap-2">
            <div className="bg-black/70 backdrop-blur-md px-4 py-2 border border-primary/50 text-primary clip-path-slant min-w-[120px] text-center">
              <span className="text-xs uppercase tracking-widest block text-muted-foreground">Score</span>
              <span className="text-3xl font-display font-bold">{score}</span>
            </div>
            
            <div className={`bg-black/70 backdrop-blur-md px-4 py-1 border border-white/20 text-white clip-path-slant min-w-[80px] text-center ${timeLeft < 10 ? 'text-red-500 border-red-500 animate-pulse' : ''}`}>
              <span className="text-xl font-mono">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Crosshair (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <Target className="w-16 h-16 text-primary animate-pulse" strokeWidth={1} />
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-center pb-8 pointer-events-auto">
          <CyberButton 
            size="xl" 
            variant="destructive"
            onClick={handleFire}
            disabled={gameOver}
            className="shadow-[0_0_50px_rgba(255,0,0,0.4)] animate-bounce-subtle"
          >
            FIRE
          </CyberButton>
        </div>
      </div>

      {/* Game Over Dialog */}
      <Dialog open={gameOver} onOpenChange={setGameOver}>
        <DialogContent className="bg-card border-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display text-center text-primary uppercase">Mission Complete</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center space-y-4">
            <TrophyIcon score={score} />
            <div className="text-center space-y-1">
              <p className="text-muted-foreground uppercase tracking-widest text-sm">Final Score</p>
              <p className="text-5xl font-black text-foreground">{score}</p>
            </div>
            
            <div className="w-full space-y-2 mt-4">
              <Label htmlFor="username">Enter Callsign</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="MAVERICK"
                className="bg-background/50 border-primary/30 text-center font-mono uppercase tracking-widest h-12 text-lg"
                maxLength={10}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <CyberButton 
              onClick={handleSubmitScore} 
              disabled={!username || createScore.isPending}
              className="w-full"
            >
              {createScore.isPending ? "Submitting..." : "Submit Score"}
            </CyberButton>
            
            <Link href="/" className="w-full">
              <CyberButton variant="outline" className="w-full">
                Main Menu
              </CyberButton>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TrophyIcon({ score }: { score: number }) {
  if (score === 0) return <Skull className="w-16 h-16 text-muted-foreground" />;
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary blur-2xl opacity-20" />
      <Target className="w-16 h-16 text-primary relative z-10" />
    </div>
  );
}
