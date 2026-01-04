import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardModules from './DashboardModules';
import MatrixRain from './MatrixRain';

interface DashboardScreenProps {
  username: string;
  onLogout: () => void;
}

const DashboardScreen = ({ username, onLogout }: DashboardScreenProps) => {
  return (
    <div className="min-h-screen bg-background scanlines">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Main content */}
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