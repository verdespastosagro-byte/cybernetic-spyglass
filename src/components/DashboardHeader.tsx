import { Eye, Shield, LogOut, Bell, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
}

const DashboardHeader = ({ username, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary text-glow" strokeWidth={1} />
              <Eye className="w-4 h-4 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-primary text-glow tracking-widest uppercase">
                SISTEMA SENTINELA
              </h1>
              <p className="text-xs text-muted-foreground">Painel de Controle v3.7.2</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="status-dot-active" />
              <span>ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot-active" />
              <span>VPN: ATIVA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot-active" />
              <span>CRIPTOGRAFIA: AES-256</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Encerrar Sessão"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;