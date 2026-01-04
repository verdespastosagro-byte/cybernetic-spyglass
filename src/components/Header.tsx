import { Globe, Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative z-10 py-6 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="w-12 h-12 text-primary text-glow animate-flicker" />
              <Shield className="w-6 h-6 text-secondary absolute -bottom-1 -right-1 text-glow-secondary" />
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-bold tracking-wider text-primary text-glow uppercase">
              AGÊNCIA CENTRAL DE INTELIGÊNCIA DIGITAL
            </h1>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <p className="text-xs md:text-sm text-destructive text-glow-destructive tracking-widest uppercase">
                ACESSO RESTRITO NÍVEL 5
              </p>
              <span className="inline-block w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </div>
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs text-muted-foreground font-mono">
            <span>STATUS: <span className="text-primary">ONLINE</span></span>
            <span>SATÉLITE: <span className="text-secondary">ATIVO</span></span>
            <span>PROTOCOLO: <span className="text-primary">SIGMA-7</span></span>
            <span>CRIPTOGRAFIA: <span className="text-primary">AES-256</span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
