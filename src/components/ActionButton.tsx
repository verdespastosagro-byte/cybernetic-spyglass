import { Loader2, Radio } from 'lucide-react';

interface ActionButtonProps {
  isProcessing: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton = ({ isProcessing, onClick, disabled }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`
        relative w-full py-4 px-6
        font-mono text-sm uppercase tracking-widest font-bold
        border-2 transition-all duration-300
        ${isProcessing 
          ? 'bg-muted border-muted-foreground text-muted-foreground cursor-not-allowed' 
          : 'bg-primary/10 border-primary text-primary text-glow border-glow hover:bg-primary hover:text-background'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        group
      `}
    >
      <div className="flex items-center justify-center gap-3">
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>PROCESSANDO... ACESSANDO SATÉLITE...</span>
          </>
        ) : (
          <>
            <Radio className="w-5 h-5 group-hover:animate-pulse" />
            <span>INICIAR PROTOCOLO DE RASTREAMENTO</span>
          </>
        )}
      </div>

      {/* Corner decorations */}
      {!isProcessing && (
        <>
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />
        </>
      )}
    </button>
  );
};

export default ActionButton;
