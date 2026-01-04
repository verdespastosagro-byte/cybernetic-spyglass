import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalOutputProps {
  lines: string[];
  isProcessing: boolean;
  showError: boolean;
}

const TerminalOutput = ({ lines, isProcessing, showError }: TerminalOutputProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="space-y-3">
      {/* Terminal header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Terminal className="w-4 h-4" />
        <span className="uppercase tracking-wider">Terminal de Saída</span>
        <div className="flex-1 border-t border-border ml-2" />
      </div>

      {/* Terminal window */}
      <div 
        ref={terminalRef}
        className="
          h-64 md:h-80 overflow-y-auto
          bg-background border-2 border-primary
          p-4 font-mono text-xs md:text-sm
          border-glow
        "
      >
        {lines.length === 0 && !isProcessing && !showError ? (
          <div className="flex items-center text-muted-foreground">
            <span className="text-primary mr-2">root@acdi:~$</span>
            <span className="animate-blink">_</span>
          </div>
        ) : (
          <div className="space-y-1 terminal-text">
            {lines.map((line, index) => (
              <div 
                key={index} 
                className={`
                  ${line.startsWith('[!]') ? 'text-secondary text-glow-secondary' : ''}
                  ${line.startsWith('[+]') ? 'text-primary text-glow' : ''}
                  ${line.startsWith('[*]') ? 'text-muted-foreground' : ''}
                  ${!line.startsWith('[') ? 'text-primary' : ''}
                `}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {line}
              </div>
            ))}
            
            {isProcessing && (
              <div className="text-primary">
                <span className="animate-blink">█</span>
              </div>
            )}

            {showError && (
              <div className="mt-4 p-4 border-2 border-destructive bg-destructive/10">
                <div className="text-destructive text-glow-destructive font-bold text-center uppercase tracking-wider animate-pulse">
                  ══════════════════════════════════════
                </div>
                <div className="text-destructive text-glow-destructive font-bold text-center uppercase tracking-wider mt-2 text-base md:text-lg">
                  ⚠ ERRO CRÍTICO ⚠
                </div>
                <div className="text-destructive text-glow-destructive text-center uppercase tracking-wider mt-2">
                  NÍVEL DE AUTORIZAÇÃO INSUFICIENTE
                </div>
                <div className="text-destructive text-glow-destructive text-center uppercase tracking-wider mt-1">
                  DADOS CRIPTOGRAFADOS
                </div>
                <div className="text-destructive text-glow-destructive font-bold text-center uppercase tracking-wider mt-2">
                  ACESSO NEGADO PELO SERVIDOR CENTRAL
                </div>
                <div className="text-destructive text-glow-destructive font-bold text-center uppercase tracking-wider mt-2">
                  ══════════════════════════════════════
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalOutput;
