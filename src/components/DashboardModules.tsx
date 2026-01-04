import { useState, useEffect } from 'react';
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
  Phone,
  ShieldX,
  X,
  Instagram,
  Copy,
  Loader2
} from 'lucide-react';
import { playWarningBeep, playErrorAlarm, playSuccessBeep, playKeystroke } from '@/lib/sounds';

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

// WhatsApp Search Module with full flow
const WhatsAppSearchModule = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'blocked'>('idle');

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playKeystroke();
    setPhoneNumber(formatPhone(e.target.value));
  };

  const handleSearch = () => {
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      playWarningBeep();
      return;
    }

    playSuccessBeep();
    setSearchState('searching');

    // Simulate search progress
    setTimeout(() => {
      setSearchState('found');
    }, 2500);

    // Show blocked screen
    setTimeout(() => {
      playErrorAlarm();
      setSearchState('blocked');
    }, 4500);
  };

  const handleReset = () => {
    setSearchState('idle');
    setPhoneNumber('');
  };

  // Fake messages data
  const fakeMessages = [
    { from: 'Alvo', text: 'Oi, tudo bem? Preciso falar com você sobre...', time: '14:32', unread: true },
    { from: 'Você', text: 'Claro, pode falar! Estou disponível agora...', time: '14:30', unread: false },
    { from: 'Alvo', text: 'Amanhã às 15h no local combinado, ok?', time: '13:45', unread: false },
    { from: 'Você', text: 'Perfeito! Levo os documentos que você pediu...', time: '13:40', unread: false },
    { from: 'Alvo', text: 'Não esquece de trazer aquilo que te pedi...', time: '12:22', unread: false },
  ];

  const fakeContacts = [
    { name: 'Maria Silva', lastMsg: 'Ok, te vejo lá!', time: '14:32', photo: '👩' },
    { name: 'João Pedro', lastMsg: 'Mandei o arquivo...', time: '13:15', photo: '👨' },
    { name: 'Ana Costa', lastMsg: 'Obrigada!', time: '11:48', photo: '👩‍💼' },
    { name: 'Carlos M.', lastMsg: 'Vamos confirmar...', time: '09:22', photo: '👨‍💻' },
  ];

  if (searchState === 'blocked') {
    return (
      <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
        {/* Blocked overlay */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <div className="relative mb-4">
            <ShieldX className="w-16 h-16 text-destructive animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-destructive text-glow uppercase mb-2">
            ACESSO NEGADO
          </h3>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Aguardando confirmação de pagamento para liberar acesso completo aos dados interceptados.
          </p>
          <div className="w-full space-y-2">
            <button className="w-full py-3 font-mono text-xs uppercase tracking-wider font-bold border-2 bg-warning/20 border-warning text-warning cut-corners-sm hover:bg-warning hover:text-background transition-all">
              DESBLOQUEAR AGORA - R$ 299,90
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              <X className="w-3 h-3" />
              Cancelar Operação
            </button>
          </div>
        </div>

        {/* Background content (blurred) */}
        <div className="blur-md opacity-50">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
            <div className="text-primary"><MessageSquare className="w-5 h-5" /></div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
              Dados Interceptados
            </h3>
          </div>
          <div className="space-y-2">
            {fakeMessages.map((msg, i) => (
              <div key={i} className="p-2 bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (searchState === 'found') {
    return (
      <div className="module-card cut-corners-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="text-primary"><MessageSquare className="w-5 h-5" /></div>
          <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
            Dados Encontrados
          </h3>
        </div>

        {/* Target info */}
        <div className="flex items-center gap-3 p-2 bg-primary/10 border border-primary/30 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg">
            📱
          </div>
          <div className="flex-1">
            <p className="text-xs text-primary font-bold">{phoneNumber}</p>
            <p className="text-xs text-secondary">WhatsApp Ativo • Online</p>
          </div>
          <div className="status-dot status-dot-active" />
        </div>

        {/* Blurred messages preview */}
        <div className="flex-1 space-y-2 relative">
          <p className="text-xs text-muted-foreground uppercase mb-2">Mensagens Recentes</p>
          {fakeMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`p-2 border border-border/50 ${msg.from === 'Alvo' ? 'bg-muted/30' : 'bg-primary/5 ml-4'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-secondary font-bold blur-[2px]">{msg.from}</span>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-xs text-foreground blur-[3px]">{msg.text}</p>
            </div>
          ))}
          
          {/* Overlay hint */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none">
            <div className="bg-background/80 px-4 py-2 border border-warning/50 text-xs text-warning animate-pulse">
              Decodificando mensagens...
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-warning">
            <span className="animate-spin">◐</span>
            <span>Carregando dados criptografados...</span>
          </div>
          <div className="mt-2 h-1 bg-muted rounded overflow-hidden">
            <div className="h-full bg-warning animate-[loading_2s_ease-in-out_infinite]" style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (searchState === 'searching') {
    return (
      <div className="module-card cut-corners-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="text-primary"><MessageSquare className="w-5 h-5" /></div>
          <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
            Buscando Dispositivo
          </h3>
        </div>

        {/* Loading animation */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-2 border-primary/30 rounded-full animate-ping absolute" />
            <div className="w-20 h-20 border-2 border-primary rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          
          <p className="text-xs text-primary font-mono mb-2">{phoneNumber}</p>
          
          <div className="space-y-1 text-center">
            <p className="text-xs text-secondary animate-pulse">Localizando dispositivo...</p>
            <p className="text-xs text-muted-foreground font-mono animate-typing overflow-hidden whitespace-nowrap">
              HANDSHAKE: 0x7F3A...CONECTANDO
            </p>
          </div>

          {/* Progress bars */}
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Conexão P2P</span>
              <span className="text-primary">78%</span>
            </div>
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '78%' }} />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Bypass SSL</span>
              <span className="text-secondary">45%</span>
            </div>
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-secondary animate-[loading_2s_ease-in-out_infinite]" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default idle state - phone input
  return (
    <div className="module-card cut-corners-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <div className="text-primary"><MessageSquare className="w-5 h-5" /></div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Interceptação WhatsApp/Mensagens
        </h3>
      </div>

      {/* Phone input */}
      <div className="mb-4">
        <label className="block text-xs text-muted-foreground uppercase mb-2">
          Número do Alvo (WhatsApp)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">+55</span>
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            className="w-full pl-12 pr-4 py-3 bg-muted/20 border-2 border-primary/50 focus:border-primary text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-glow transition-all"
          />
        </div>
      </div>

      {/* Contact list preview */}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase mb-2">Alvos Recentes (Borrado)</p>
        <div className="space-y-2">
          {fakeContacts.map((contact, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 border border-border/50">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm blur-[2px]">
                {contact.photo}
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground font-bold blur-[3px]">{contact.name}</p>
                <p className="text-xs text-muted-foreground blur-[4px]">{contact.lastMsg}</p>
              </div>
              <span className="text-xs text-secondary">{contact.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Encryption indicator */}
      <div className="flex items-center gap-2 text-xs text-destructive my-3">
        <Lock className="w-3 h-3" />
        <span>Criptografia Ativa</span>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleSearch}
        className="w-full py-3 font-mono text-xs uppercase tracking-wider font-bold border-2 bg-primary/10 border-primary text-primary hover:bg-primary hover:text-background border-glow transition-all cut-corners-sm flex items-center justify-center gap-2"
      >
        Tentar Conexão P2P
      </button>
    </div>
  );
};

// Fake contact list for WhatsApp module (kept for reference but not used anymore)
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

// Instagram Profile Search Module
const InstagramSearchModule = () => {
  const [username, setUsername] = useState('');
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'found' | 'cloning' | 'blocked'>('idle');
  const [profileData, setProfileData] = useState<{
    username: string;
    fullName: string;
    profilePic: string;
    followers: string;
    following: string;
    posts: string;
    isVerified?: boolean;
  } | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const fetchInstagramProfile = async (user: string): Promise<{
    username: string;
    fullName: string;
    profilePic: string;
    followers: string;
    following: string;
    posts: string;
    isVerified: boolean;
  } | null> => {
    try {
      // Use a CORS proxy to fetch Instagram data
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const instagramUrl = encodeURIComponent(`https://www.instagram.com/${user}/?__a=1&__d=dis`);
      
      const response = await fetch(proxyUrl + instagramUrl, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.graphql?.user) {
            const userData = data.graphql.user;
            return {
              username: userData.username,
              fullName: userData.full_name || userData.username,
              profilePic: userData.profile_pic_url_hd || userData.profile_pic_url,
              followers: formatNumber(userData.edge_followed_by?.count || 0),
              following: formatNumber(userData.edge_follow?.count || 0),
              posts: formatNumber(userData.edge_owner_to_timeline_media?.count || 0),
              isVerified: userData.is_verified || false
            };
          }
        } catch {
          // JSON parse failed, try alternative method
        }
      }
    } catch (error) {
      console.log('Primary fetch failed, trying alternative...');
    }

    // Alternative: Try to get profile pic directly from Instagram CDN
    try {
      // Use Instagram's profile picture URL pattern
      const picUrl = `https://instagram.com/${user}/`;
      return {
        username: user,
        fullName: user,
        profilePic: `https://unavatar.io/instagram/${user}`,
        followers: '---',
        following: '---',
        posts: '---',
        isVerified: false
      };
    } catch {
      return null;
    }
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    playKeystroke();
    const value = e.target.value.replace('@', '').toLowerCase().trim();
    setUsername(value);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (value.length >= 3) {
      setSearchState('searching');
      
      // Debounce the search
      const timeout = setTimeout(async () => {
        const profile = await fetchInstagramProfile(value);
        
        if (profile) {
          setProfileData(profile);
          setSearchState('found');
          playSuccessBeep();
        } else {
          // Fallback with unavatar service for profile pic
          setProfileData({
            username: value,
            fullName: value,
            profilePic: `https://unavatar.io/instagram/${value}`,
            followers: '---',
            following: '---',
            posts: '---',
            isVerified: false
          });
          setSearchState('found');
          playSuccessBeep();
        }
      }, 800);
      
      setSearchTimeout(timeout);
    } else {
      setSearchState('idle');
      setProfileData(null);
    }
  };

  const handleClone = () => {
    playWarningBeep();
    setSearchState('cloning');

    setTimeout(() => {
      playErrorAlarm();
      setSearchState('blocked');
    }, 3000);
  };

  const handleReset = () => {
    setSearchState('idle');
    setUsername('');
    setProfileData(null);
  };

  // Fake posts data
  const fakePosts = [
    { likes: '2.3M', comments: '45K', time: '2h' },
    { likes: '1.8M', comments: '32K', time: '1d' },
    { likes: '3.1M', comments: '67K', time: '3d' },
    { likes: '956K', comments: '23K', time: '5d' },
    { likes: '2.7M', comments: '89K', time: '1w' },
    { likes: '1.2M', comments: '41K', time: '2w' },
  ];

  if (searchState === 'blocked') {
    return (
      <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
        {/* Blocked overlay */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <div className="relative mb-4">
            <ShieldX className="w-16 h-16 text-destructive animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-destructive text-glow uppercase mb-2">
            CLONAGEM BLOQUEADA
          </h3>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Perfil localizado. Aguardando liberação de pagamento para concluir clonagem do perfil @{username}.
          </p>
          <div className="w-full space-y-2">
            <button className="w-full py-3 font-mono text-xs uppercase tracking-wider font-bold border-2 bg-warning/20 border-warning text-warning cut-corners-sm hover:bg-warning hover:text-background transition-all">
              LIBERAR CLONAGEM - R$ 499,90
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              <X className="w-3 h-3" />
              Cancelar Operação
            </button>
          </div>
        </div>

        {/* Background content (blurred) */}
        <div className="blur-md opacity-50">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
            <div className="text-pink-500"><Instagram className="w-5 h-5" /></div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
              Clonando Perfil
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fakePosts.map((_, i) => (
              <div key={i} className="aspect-square bg-muted/50 border border-border/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (searchState === 'cloning') {
    return (
      <div className="module-card cut-corners-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="text-pink-500"><Instagram className="w-5 h-5" /></div>
          <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
            Clonando Perfil
          </h3>
        </div>

        {/* Loading animation */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500/50">
              <img 
                src={profileData?.profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover animate-pulse"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background border-2 border-pink-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />
            </div>
          </div>
          
          <p className="text-xs text-pink-500 font-mono mb-2">@{username}</p>
          
          <div className="space-y-1 text-center">
            <p className="text-xs text-secondary animate-pulse">Extraindo dados do perfil...</p>
            <p className="text-xs text-muted-foreground font-mono animate-typing overflow-hidden whitespace-nowrap">
              BYPASS: API_GRAPH...COPIANDO
            </p>
          </div>

          {/* Progress bars */}
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Fotos</span>
              <span className="text-pink-500">67%</span>
            </div>
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-pink-500 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '67%' }} />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Stories</span>
              <span className="text-secondary">34%</span>
            </div>
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-secondary animate-[loading_2s_ease-in-out_infinite]" style={{ width: '34%' }} />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">DMs Privadas</span>
              <span className="text-destructive">12%</span>
            </div>
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-destructive animate-[loading_2.5s_ease-in-out_infinite]" style={{ width: '12%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (searchState === 'found' && profileData) {
    return (
      <div className="module-card cut-corners-lg h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="text-pink-500"><Instagram className="w-5 h-5" /></div>
          <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
            Perfil Localizado
          </h3>
        </div>

        {/* Profile info with scanner effect */}
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/30 mb-4">
          <div className="relative w-16 h-16">
            {/* Scanner ring animation */}
            <div className="absolute inset-0 rounded-full border-2 border-pink-500 animate-ping opacity-30" />
            <div className="absolute inset-0 rounded-full border-2 border-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Profile picture container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-pink-500">
              <img 
                src={profileData.profilePic} 
                alt={profileData.username}
                className="w-full h-full object-cover"
              />
              
              {/* Scanner line effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-profile-scan" />
              </div>
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary" />
            </div>
            
            {/* Data extraction indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <Search className="w-2.5 h-2.5 text-background" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">{profileData.fullName}</p>
              {profileData.isVerified && (
                <span className="text-secondary text-xs">✓</span>
              )}
            </div>
            <p className="text-xs text-pink-500 font-mono">@{profileData.username}</p>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
              <span><strong className="text-foreground">{profileData.posts}</strong> posts</span>
              <span><strong className="text-foreground">{profileData.followers}</strong> seg.</span>
              <span><strong className="text-foreground">{profileData.following}</strong> seguindo</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="status-dot status-dot-active" />
            <span className="text-xs text-primary font-mono">ATIVO</span>
          </div>
        </div>

        {/* Scanning status */}
        <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/30 mb-3">
          <Loader2 className="w-3 h-3 text-primary animate-spin" />
          <span className="text-xs text-primary font-mono animate-pulse">EXTRAINDO DADOS DO PERFIL...</span>
        </div>

        {/* Posts preview (blurred) */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase mb-2">Publicações Recentes</p>
          <div className="grid grid-cols-3 gap-1.5">
            {fakePosts.map((post, i) => (
              <div key={i} className="relative aspect-square bg-muted/30 border border-border/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/60 transition-opacity">
                  <div className="text-center text-xs">
                    <p className="text-foreground font-bold blur-[3px]">{post.likes}</p>
                    <p className="text-muted-foreground blur-[3px]">{post.comments}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-border space-y-2">
          <div className="flex items-center gap-2 text-xs text-destructive">
            <Lock className="w-3 h-3" />
            <span>Perfil privado detectado</span>
          </div>
          
          <button 
            onClick={handleClone}
            className="w-full py-3 font-mono text-xs uppercase tracking-wider font-bold border-2 bg-pink-500/10 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white cut-corners-sm flex items-center justify-center gap-2 transition-all"
          >
            <Copy className="w-4 h-4" />
            Clonar Instagram
          </button>
        </div>
      </div>
    );
  }

  // Default idle state - username input
  return (
    <div className="module-card cut-corners-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <div className="text-pink-500"><Instagram className="w-5 h-5" /></div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Varredura de Perfil Instagram
        </h3>
      </div>

      {/* Username input */}
      <div className="mb-4">
        <label className="block text-xs text-muted-foreground uppercase mb-2">
          Nome de Usuário do Alvo
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 text-sm font-bold">@</span>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="neymarjr"
            className="w-full pl-8 pr-4 py-3 bg-muted/20 border-2 border-pink-500/50 focus:border-pink-500 text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none transition-all"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Digite o @ do perfil para localizar</p>
      </div>

      {/* Suggestions */}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase mb-2">Perfis Sugeridos</p>
        <div className="space-y-2">
          {[
            { user: 'neymarjr', name: 'Neymar Jr' },
            { user: 'cristiano', name: 'Cristiano Ronaldo' },
            { user: 'leomessi', name: 'Leo Messi' },
            { user: 'kimkardashian', name: 'Kim Kardashian' }
          ].map(({ user, name }) => (
            <button 
              key={user}
              onClick={() => {
                setUsername(user);
                handleUsernameChange({ target: { value: user } } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="w-full flex items-center gap-3 p-2 bg-muted/30 border border-border/50 hover:border-pink-500/50 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={`https://unavatar.io/instagram/${user}`} 
                  alt={user}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground font-bold">@{user}</p>
                <p className="text-xs text-muted-foreground">{name}</p>
              </div>
              <Search className="w-3 h-3 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Encryption indicator */}
      <div className="flex items-center gap-2 text-xs text-destructive my-3">
        <Lock className="w-3 h-3" />
        <span>Varredura Anônima Ativa</span>
      </div>
    </div>
  );
};

const DashboardModules = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {/* WhatsApp Module - Custom with full flow */}
      <WhatsAppSearchModule />

      {/* Instagram Module - Custom with full flow */}
      <InstagramSearchModule />

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