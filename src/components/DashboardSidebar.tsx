import { useState, useEffect } from 'react';
import { Shield, Wifi, Lock, User, Award, MapPin } from 'lucide-react';
import MiniGlobeWidget from './MiniGlobeWidget';

interface DashboardSidebarProps {
  username: string;
}

interface UserLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
}

const DashboardSidebar = ({ username }: DashboardSidebarProps) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          isp: data.org || 'Desconhecido'
        });
      } catch (error) {
        // Fallback with fake data if API fails
        setUserLocation({
          ip: '189.xxx.xxx.xxx',
          city: 'São Paulo',
          region: 'SP',
          country: 'Brasil',
          isp: 'Operadora Local'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <aside className="w-full lg:w-72 space-y-4">
      {/* Connection Status */}
      <div className="module-card cut-corners">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Status da Conexão
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="status-dot-active" />
          <span className="text-sm text-primary text-glow uppercase">
            Criptografada
          </span>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
          <Lock className="w-3 h-3" />
          <span>VPN ATIVA</span>
        </div>

        {/* User IP and Location */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3 h-3 text-destructive" />
            <span className="text-xs text-destructive uppercase">Seu Acesso</span>
          </div>
          
          {loading ? (
            <div className="space-y-1">
              <div className="h-3 bg-muted/50 animate-pulse rounded w-3/4" />
              <div className="h-3 bg-muted/50 animate-pulse rounded w-1/2" />
            </div>
          ) : (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>IP:</span>
                <span className="text-warning font-mono">{userLocation?.ip}</span>
              </div>
              <div className="flex justify-between">
                <span>Local:</span>
                <span className="text-warning">{userLocation?.city}, {userLocation?.region}</span>
              </div>
              <div className="flex justify-between">
                <span>País:</span>
                <span className="text-warning">{userLocation?.country}</span>
              </div>
              <div className="flex justify-between">
                <span>ISP:</span>
                <span className="text-warning text-right truncate max-w-[120px]">{userLocation?.isp}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Protocolo:</span>
            <span className="text-primary">WireGuard</span>
          </div>
          <div className="flex justify-between">
            <span>Servidor:</span>
            <span className="text-primary">███████</span>
          </div>
          <div className="flex justify-between">
            <span>Ping:</span>
            <span className="text-secondary">23ms</span>
          </div>
        </div>
      </div>

      {/* Mini Globe */}
      <div className="module-card cut-corners">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Localização Atual
          </span>
        </div>
        
        <MiniGlobeWidget />
        
        <div className="mt-2 text-xs text-center text-secondary">
          <span className="status-dot-error mr-2" />
          Ponto de Acesso Ativo
        </div>
      </div>

      {/* User Info */}
      <div className="module-card cut-corners">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Perfil do Agente
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 border border-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-primary text-glow uppercase font-bold">
                {username}
              </p>
              <p className="text-xs text-muted-foreground">ID: #A7X-{Math.floor(Math.random() * 9000 + 1000)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning">
            <Award className="w-4 h-4 text-warning" />
            <span className="text-xs text-warning uppercase font-bold">
              Nível: Premium
            </span>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Sessão:</span>
              <span className="text-primary">Ativa</span>
            </div>
            <div className="flex justify-between">
              <span>Último acesso:</span>
              <span className="text-primary">Agora</span>
            </div>
            <div className="flex justify-between">
              <span>Créditos:</span>
              <span className="text-secondary">∞</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="module-card cut-corners">
        <div className="text-xs text-muted-foreground space-y-2">
          <div className="flex justify-between items-center">
            <span>CPU:</span>
            <div className="flex-1 mx-2 h-1 bg-muted">
              <div className="h-full bg-primary w-3/4" />
            </div>
            <span className="text-primary">74%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>RAM:</span>
            <div className="flex-1 mx-2 h-1 bg-muted">
              <div className="h-full bg-secondary w-1/2" />
            </div>
            <span className="text-secondary">52%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>REDE:</span>
            <div className="flex-1 mx-2 h-1 bg-muted">
              <div className="h-full bg-primary w-4/5" />
            </div>
            <span className="text-primary">156 Mb/s</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;