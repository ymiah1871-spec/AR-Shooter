import { Link } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { CyberCard } from "@/components/CyberCard";
import { useScores } from "@/hooks/use-scores";
import { ArrowLeft, Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { data: scores, isLoading, error } = useScores();

  // Sort scores descending
  const sortedScores = scores?.sort((a, b) => b.score - a.score) || [];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <CyberButton variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </CyberButton>
          </Link>
          <h1 className="text-3xl md:text-4xl font-display text-primary uppercase tracking-widest">
            Elite Squad
          </h1>
          <div className="w-24" /> {/* Spacer for balance */}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-mono animate-pulse">SYNCING DATA...</p>
          </div>
        ) : error ? (
          <CyberCard className="border-destructive/50 text-center py-12">
            <p className="text-destructive">Failed to load leaderboard data.</p>
          </CyberCard>
        ) : sortedScores.length === 0 ? (
          <CyberCard className="text-center py-12">
            <p className="text-muted-foreground">No scores yet. Be the first!</p>
            <Link href="/game" className="inline-block mt-4">
              <CyberButton>Start Mission</CyberButton>
            </Link>
          </CyberCard>
        ) : (
          <div className="space-y-4">
            {sortedScores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard 
                  className={`flex items-center justify-between p-4 ${
                    index === 0 ? 'border-yellow-500/50 bg-yellow-500/5' : 
                    index === 1 ? 'border-gray-400/50' :
                    index === 2 ? 'border-orange-700/50' : ''
                  }`}
                  hoverEffect
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center font-display text-2xl font-bold">
                      {index === 0 ? <Crown className="w-8 h-8 text-yellow-500" /> :
                       index === 1 ? <Medal className="w-7 h-7 text-gray-400" /> :
                       index === 2 ? <Medal className="w-6 h-6 text-orange-700" /> :
                       <span className="text-muted-foreground">#{index + 1}</span>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-wider uppercase text-foreground">
                        {score.username}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {new Date(score.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="block text-2xl font-display font-bold text-primary">
                      {score.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground tracking-widest">PTS</span>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
