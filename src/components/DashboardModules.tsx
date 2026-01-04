import { useState } from 'react';
import { 
  MessageSquare, 
  Lock, 
  AtSign, 
  Search, 
  MapPin, 
  Radio,
  AudioWaveform,
  Clock,
  AlertTriangle,
  User,
  Phone
} from 'lucide-react';
import { playWarningBeep, playErrorAlarm } from '@/lib/sounds';

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary';
  errorMessage?: string;
}

const ModuleCard = ({ 
  title, 
  icon, 
  children, 
  buttonText, 
  buttonVariant = 'primary',
  errorMessage = "ERRO: PACOTE PREMIUM NECESSÁRIO PARA DESBLOQUEAR ESTA FUNÇÃO."
}: ModuleCardProps) => {
  const [showError, setShowError] = useState(false);
  const [buttonState, setButtonState] = useState<'idle' | 'warning' | 'error'>('idle');

  const handleClick = () => {
    playWarningBeep();
    setButtonState('warning');
    
    setTimeout(() => {
      playErrorAlarm();
      setButtonState('error');
      setShowError(true);
    }, 1500);

    setTimeout(() => {
      setButtonState('idle');
      setShowError(false);
    }, 5000);
  };

  const getButtonClasses = () => {
    const base = "w-full py-3 font-mono text-xs uppercase tracking-wider font-bold border-2 transition-all duration-300 cut-corners-sm flex items-center justify-center gap-2";
    
    switch (buttonState) {
      case 'warning':
        return `${base} bg-warning/20 border-warning text-warning border-glow-warning`;
      case 'error':
        return `${base} bg-destructive/20 border-destructive text-destructive border-glow-destructive`;
      default:
        return buttonVariant === 'secondary'
          ? `${base} bg-secondary/10 border-secondary text-secondary hover:bg-secondary hover:text-background border-glow-secondary`
          : `${base} bg-primary/10 border-primary text-primary hover:bg-primary hover:text-background border-glow`;
    }
  };

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <div className="text-primary">{icon}</div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 mb-4">
        {children}
      </div>

      {/* Encryption indicator */}
      <div className="flex items-center gap-2 text-xs text-destructive mb-3">
        <Lock className="w-3 h-3" />
        <span>Criptografia Ativa</span>
      </div>

      {/* Action Button */}
      <button onClick={handleClick} className={getButtonClasses()}>
        {buttonState === 'warning' && <span className="animate-spin">◐</span>}
        {buttonState === 'error' && <AlertTriangle className="w-4 h-4" />}
        {buttonState === 'idle' ? buttonText : buttonState === 'warning' ? 'AGUARDANDO SINAL...' : 'BLOQUEADO'}
      </button>

      {/* Error Message */}
      {showError && (
        <div className="mt-3 p-2 bg-destructive/10 border border-destructive text-xs text-destructive text-center animate-pulse">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

// Fake contact list for WhatsApp module
const FakeContactList = () => {
  const contacts = [
    { name: '████████', time: '14:32', blur: true },
    { name: '██████', time: '13:15', blur: true },
    { name: '███████████', time: '11:48', blur: true },
    { name: '████', time: '09:22', blur: true },
  ];

  return (
    <div className="space-y-2">
      {contacts.map((contact, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 border border-border/50">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground blur-sm">{contact.name}</p>
          </div>
          <span className="text-xs text-secondary">{contact.time}</span>
        </div>
      ))}
    </div>
  );
};

// Fake activity chart
const FakeActivityChart = () => {
  const bars = [65, 40, 85, 30, 70, 55, 90, 45, 75, 60];
  
  return (
    <div className="h-24 flex items-end justify-between gap-1 p-2">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-secondary/60 animate-data-pulse"
          style={{ 
            height: `${height}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// Fake map with coordinates
const FakeGPSMap = () => {
  const [coords, setCoords] = useState({ lat: -23.550, lng: -46.633 });

  // Simulate changing coordinates
  useState(() => {
    const interval = setInterval(() => {
      setCoords({
        lat: -23.550 + (Math.random() - 0.5) * 0.01,
        lng: -46.633 + (Math.random() - 0.5) * 0.01
      });
    }, 500);
    return () => clearInterval(interval);
  });

  return (
    <div className="relative h-32 bg-muted/20 border border-border overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(120 100% 55% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(120 100% 55% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Target reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-destructive rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-destructive -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* Coordinates */}
      <div className="absolute bottom-2 left-2 text-xs font-mono text-secondary animate-coordinates">
        LAT: {coords.lat.toFixed(4)}°
      </div>
      <div className="absolute bottom-2 right-2 text-xs font-mono text-secondary animate-coordinates">
        LONG: {coords.lng.toFixed(4)}°
      </div>
    </div>
  );
};

// Fake call log
const FakeCallLog = () => {
  const calls = [
    { type: 'in', number: '+55 11 9████-████', duration: '04:32', time: '16:45' },
    { type: 'out', number: '+55 21 9████-████', duration: '12:18', time: '14:22' },
    { type: 'in', number: '+55 11 9████-████', duration: '01:05', time: '11:30' },
  ];

  return (
    <div className="space-y-2">
      {calls.map((call, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 border border-border/50 text-xs">
          <Phone className={`w-3 h-3 ${call.type === 'in' ? 'text-primary rotate-180' : 'text-secondary'}`} />
          <span className="flex-1 text-muted-foreground blur-sm">{call.number}</span>
          <span className="text-primary">{call.duration}</span>
          <span className="text-muted-foreground">{call.time}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardModules = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {/* WhatsApp Module */}
      <ModuleCard
        title="Interceptação WhatsApp/Mensagens"
        icon={<MessageSquare className="w-5 h-5" />}
        buttonText="Tentar Conexão P2P"
        buttonVariant="primary"
      >
        <FakeContactList />
      </ModuleCard>

      {/* Social Media Module */}
      <ModuleCard
        title="Varredura de Redes Sociais"
        icon={
          <div className="relative">
            <AtSign className="w-5 h-5" />
            <Search className="w-3 h-3 absolute -bottom-1 -right-1 text-secondary" />
          </div>
        }
        buttonText="Iniciar Varredura de Perfil"
        buttonVariant="secondary"
      >
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase">Atividade Recente</p>
          <FakeActivityChart />
        </div>
      </ModuleCard>

      {/* GPS Module */}
      <ModuleCard
        title="Rastreamento de Localização GPS"
        icon={
          <div className="relative">
            <MapPin className="w-5 h-5" />
            <Radio className="w-3 h-3 absolute -top-1 -right-1 text-secondary animate-pulse" />
          </div>
        }
        buttonText="Triangular Sinal ao Vivo"
        buttonVariant="primary"
        errorMessage="AGUARDANDO SINAL DO DISPOSITIVO ALVO..."
      >
        <FakeGPSMap />
      </ModuleCard>

      {/* Call Log Module */}
      <ModuleCard
        title="Registro de Chamadas e Áudio"
        icon={<AudioWaveform className="w-5 h-5" />}
        buttonText="Acessar Arquivo Morto"
        buttonVariant="secondary"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Últimas 24 horas</span>
          </div>
          <FakeCallLog />
        </div>
      </ModuleCard>
    </div>
  );
};

export default DashboardModules;