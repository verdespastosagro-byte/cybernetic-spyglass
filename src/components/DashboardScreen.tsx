import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardModules from './DashboardModules';
import MatrixRain from './MatrixRain';
import WaitingDashboard from './WaitingDashboard';
import TargetSearchScreen from './TargetSearchScreen';

interface DashboardScreenProps {
  username: string;
  onLogout: () => void;
}

type DashboardState = 'waiting' | 'searching' | 'monitoring';

const DashboardScreen = ({ username, onLogout }: DashboardScreenProps) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>('waiting');
  const [targetPhone, setTargetPhone] = useState<string>('');

  const handleStartSearch = () => {
    setDashboardState('searching');
  };

  const handleTargetFound = (phoneNumber: string) => {
    setTargetPhone(phoneNumber);
    setDashboardState('monitoring');
  };

  const handleCancelSearch = () => {
    setDashboardState('waiting');
  };

  const handleNewOperation = () => {
    setTargetPhone('');
    setDashboardState('waiting');
  };

  // Show waiting dashboard (no target selected)
  if (dashboardState === 'waiting') {
    return (
      <WaitingDashboard 
        username={username}
        onLogout={onLogout}
        onStartSearch={handleStartSearch}
      />
    );
  }

  // Show search screen (entering target phone)
  if (dashboardState === 'searching') {
    return (
      <TargetSearchScreen 
        onTargetFound={handleTargetFound}
        onCancel={handleCancelSearch}
      />
    );
  }

  // Show full monitoring dashboard (target found)
  return (
    <div className="min-h-screen bg-background scanlines">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Main content */}
      <div className="relative z-10">
        <DashboardHeader username={username} onLogout={onLogout} />

        <main className="container mx-auto px-4 py-6">
          {/* Page Title with Target Info */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-primary text-glow uppercase tracking-widest">
                  ◆ Monitoramento Ativo ◆
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-block w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm text-destructive font-mono">{targetPhone}</span>
                  <span className="text-xs text-muted-foreground">• Dispositivo comprometido</span>
                </div>
              </div>
              
              <button
                onClick={handleNewOperation}
                className="px-4 py-2 font-mono text-xs uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all"
              >
                ← Nova Operação
              </button>
            </div>
            <div className="mt-3 h-px bg-gradient-to-r from-destructive via-primary to-transparent" />
          </div>

          {/* Dashboard Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <DashboardSidebar username={username} />

            {/* Main Modules Area */}
            <div className="flex-1">
              <DashboardModules />
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
                <span className="text-destructive animate-pulse">
                  ⚡ Sessão Monitorada
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardScreen;
