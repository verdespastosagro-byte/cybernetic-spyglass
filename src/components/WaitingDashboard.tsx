import { useState, useEffect } from 'react';
import { 
  Shield, 
  Wifi, 
  Lock, 
  User, 
  Award, 
  MapPin,
  Server,
  Activity,
  Satellite,
  Radio,
  Clock,
  Cpu,
  Database,
  Globe
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import MatrixRain from './MatrixRain';
import { CommandConsoleModule } from './SpyModules';

interface WaitingDashboardProps {
  username: string;
  onLogout: () => void;
  onStartSearch: () => void;
}

const WaitingDashboard = ({ username, onLogout, onStartSearch }: WaitingDashboardProps) => {
  const [systemTime, setSystemTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    uptime: '00:00:00',
    connections: 0,
    dataProcessed: '0 MB',
    threatsBlocked: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date());
      setSystemStats(prev => ({
        uptime: formatUptime(Date.now()),
        connections: Math.floor(Math.random() * 50) + 100,
        dataProcessed: `${(Math.random() * 100).toFixed(1)} GB`,
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor((time / 3600000) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background scanlines">
      <MatrixRain />

      <div className="relative z-10">
        <DashboardHeader username={username} onLogout={onLogout} />

        <main className="container mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary text-glow uppercase tracking-widest">
              ◆ Central de Operações ◆
            </h2>
            <div className="mt-2 h-px bg-gradient-to-r from-primary via-secondary to-transparent" />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <DashboardSidebar username={username} />

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
              {/* System Status Banner */}
              <div className="module-card cut-corners-lg p-6 border-2 border-primary/50 bg-primary/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center bg-primary/20">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Activity className="w-3 h-3 text-background" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary text-glow uppercase">
                        Sistema Sentinel
                      </h3>
                      <p className="text-sm text-secondary">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                        Operacional - Aguardando Alvo
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onStartSearch}
                    className="px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold border-2 bg-destructive/20 border-destructive text-destructive hover:bg-destructive hover:text-white cut-corners-sm flex items-center justify-center gap-3 transition-all animate-pulse"
                  >
                    <Satellite className="w-5 h-5" />
                    Iniciar Nova Operação
                  </button>
                </div>
              </div>

              {/* System Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, label: 'Uptime', value: systemStats.uptime, color: 'primary' },
                  { icon: Radio, label: 'Conexões', value: systemStats.connections.toString(), color: 'secondary' },
                  { icon: Database, label: 'Dados', value: systemStats.dataProcessed, color: 'primary' },
                  { icon: Shield, label: 'Ameaças', value: systemStats.threatsBlocked.toString(), color: 'destructive' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="module-card cut-corners p-4 text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 text-${color}`} />
                    <p className="text-xs text-muted-foreground uppercase">{label}</p>
                    <p className={`text-lg font-mono font-bold text-${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Waiting Message */}
              <div className="module-card cut-corners-lg p-8 text-center border-2 border-dashed border-border">
                <div className="mb-6">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping" />
                    <div className="absolute inset-2 border-2 border-secondary/40 rounded-full animate-pulse" />
                    <div className="absolute inset-4 border-2 border-primary/50 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-foreground uppercase tracking-wider mb-2">
                  Nenhum Alvo Selecionado
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  O sistema está pronto para iniciar uma operação de monitoramento. 
                  Clique no botão acima para inserir o número do dispositivo alvo.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                  <span className="px-3 py-1 bg-muted/30 border border-border">📱 WhatsApp</span>
                  <span className="px-3 py-1 bg-muted/30 border border-border">📸 Instagram</span>
                  <span className="px-3 py-1 bg-muted/30 border border-border">📍 GPS</span>
                  <span className="px-3 py-1 bg-muted/30 border border-border">🎤 Áudio</span>
                  <span className="px-3 py-1 bg-muted/30 border border-border">📷 Câmera</span>
                </div>
              </div>

              {/* Command Console - Always visible */}
              <CommandConsoleModule />

              {/* System Time */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">
                    {systemTime.toLocaleDateString('pt-BR')} - {systemTime.toLocaleTimeString('pt-BR')}
                  </span>
                </div>
                <span>|</span>
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-primary" />
                  <span>Servidor: ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
              <p>© 2024 SISTEMA SENTINELA - Todos os direitos reservados</p>
              <div className="flex items-center gap-4">
                <span>Build: 3.7.2-stable</span>
                <span>|</span>
                <span className="text-primary animate-pulse">
                  ⏳ Aguardando Alvo
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WaitingDashboard;
