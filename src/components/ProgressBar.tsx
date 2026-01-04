interface ProgressBarProps {
  progress: number;
  isVisible: boolean;
}

const ProgressBar = ({ progress, isVisible }: ProgressBarProps) => {
  if (!isVisible) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>{`> DOWNLOAD DE DADOS...`}</span>
        <span className="text-primary text-glow">{`[${Math.round(progress)}%]`}</span>
      </div>
      <div className="h-4 bg-muted border border-primary relative overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-100 animate-progress-glow"
          style={{ width: `${progress}%` }}
        />
        {/* Animated stripes */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px)',
            animation: 'moveStripes 1s linear infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes moveStripes {
          0% { background-position: 0 0; }
          100% { background-position: 28px 0; }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
