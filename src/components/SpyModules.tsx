import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Camera, 
  Mic, 
  Keyboard, 
  Image, 
  Battery, 
  Wifi, 
  Signal,
  Terminal,
  Eye,
  EyeOff,
  Video,
  Flame,
  Lock,
  AlertTriangle,
  Radio,
  Play
} from 'lucide-react';
import { playKeystroke, playWarningBeep } from '@/lib/sounds';

// 1. Geolocation Module - Real-time satellite map
export const GeolocationModule = () => {
  const [coords, setCoords] = useState({ lat: -23.5505, lng: -46.6333 });
  const [zoom, setZoom] = useState(1);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isTracking) {
      // Start zoom animation
      setIsTracking(true);
      const zoomInterval = setInterval(() => {
        setZoom(prev => {
          if (prev >= 15) {
            clearInterval(zoomInterval);
            return prev;
          }
          return prev + 0.5;
        });
      }, 100);

      return () => clearInterval(zoomInterval);
    }
  }, []);

  useEffect(() => {
    // Animate coordinates
    const coordInterval = setInterval(() => {
      setCoords(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001
      }));
    }, 500);

    return () => clearInterval(coordInterval);
  }, []);

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="text-destructive">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Geolocalização em Tempo Real
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-destructive rounded-full animate-ping" />
          <span className="text-xs text-destructive font-mono">RASTREANDO</span>
        </div>
      </div>

      {/* Satellite Map Simulation */}
      <div className="flex-1 relative bg-[#0a1628] rounded overflow-hidden min-h-[180px]">
        {/* Dark map background with grid */}
        <div className="absolute inset-0">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 / zoom * 10}px ${20 / zoom * 10}px`
          }} />
          
          {/* Simulated map features */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 30% 40%, rgba(0, 255, 136, 0.03) 0%, transparent 30%),
              radial-gradient(circle at 70% 60%, rgba(0, 255, 136, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(0, 100, 200, 0.05) 0%, transparent 50%)
            `
          }} />

          {/* Street lines (appear as zoom increases) */}
          {zoom > 8 && (
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-muted-foreground to-transparent" />
              <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-muted-foreground to-transparent" />
              <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-muted-foreground to-transparent" />
              <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-muted-foreground to-transparent" />
            </div>
          )}
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Ping circles */}
            <div className="absolute -inset-8 border border-destructive/30 rounded-full animate-ping" />
            <div className="absolute -inset-4 border border-destructive/50 rounded-full animate-pulse" />
            
            {/* Target point */}
            <div className="w-4 h-4 bg-destructive rounded-full shadow-lg animate-pulse relative z-10" style={{
              boxShadow: '0 0 20px hsl(0 100% 50%), 0 0 40px hsl(0 100% 50% / 0.5)'
            }} />
            
            {/* Crosshair lines */}
            <div className="absolute top-1/2 -left-6 w-4 h-0.5 bg-destructive/70" />
            <div className="absolute top-1/2 -right-6 w-4 h-0.5 bg-destructive/70" />
            <div className="absolute -top-6 left-1/2 h-4 w-0.5 bg-destructive/70 -translate-x-1/2" />
            <div className="absolute -bottom-6 left-1/2 h-4 w-0.5 bg-destructive/70 -translate-x-1/2" />
          </div>
        </div>

        {/* Moving target indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-xs text-destructive font-mono bg-background/80 px-2 py-1 -translate-y-8 whitespace-nowrap animate-pulse">
            ALVO EM MOVIMENTO
          </div>
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line" />
        </div>
      </div>

      {/* Coordinates display */}
      <div className="mt-3 p-2 bg-background/50 border border-border font-mono text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">LAT:</span>
          <span className="text-primary animate-pulse">{coords.lat.toFixed(6)}°</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">LNG:</span>
          <span className="text-primary animate-pulse">{coords.lng.toFixed(6)}°</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">PRECISÃO:</span>
          <span className="text-secondary">±3m</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">ZOOM:</span>
          <span className="text-warning">{zoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-destructive flex items-center gap-1">
          <Radio className="w-3 h-3 animate-pulse" />
          Sinal GPS Ativo
        </span>
        <span className="text-muted-foreground">Última atualização: agora</span>
      </div>
    </div>
  );
};

// 2. Camera Viewer Module - Webcam hack simulation
export const CameraViewerModule = () => {
  const [status, setStatus] = useState<'connecting' | 'glitch' | 'dark'>('connecting');
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    // Cycle through states
    const cycle = () => {
      setStatus('connecting');
      
      setTimeout(() => {
        setShowGlitch(true);
        setStatus('glitch');
        playWarningBeep();
        
        setTimeout(() => {
          setShowGlitch(false);
          setStatus('dark');
        }, 500);
      }, 3000);

      setTimeout(() => {
        setStatus('connecting');
      }, 8000);
    };

    cycle();
    const interval = setInterval(cycle, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="text-secondary">
          <Camera className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Visualizador de Câmera
        </h3>
        <div className="ml-auto">
          {status === 'connecting' && <Eye className="w-4 h-4 text-warning animate-pulse" />}
          {status === 'dark' && <EyeOff className="w-4 h-4 text-destructive" />}
        </div>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative bg-black rounded overflow-hidden min-h-[160px]">
        {/* Connecting state */}
        {status === 'connecting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-2 border-primary rounded-full border-t-transparent animate-spin mb-4" />
            <p className="text-primary font-mono text-sm animate-pulse">CONECTANDO DISPOSITIVO DE VÍDEO...</p>
            <p className="text-muted-foreground font-mono text-xs mt-2">Câmera frontal detectada</p>
          </div>
        )}

        {/* Glitch effect */}
        {showGlitch && (
          <div className="absolute inset-0 animate-glitch-text">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 via-transparent to-primary/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-muted/20 rounded-full blur-xl animate-pulse" />
            </div>
            {/* Scan lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="absolute left-0 right-0 h-px bg-white/10"
                style={{ top: `${i * 10}%` }}
              />
            ))}
          </div>
        )}

        {/* Dark/no signal state */}
        {status === 'dark' && !showGlitch && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black to-muted/10">
            <Camera className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-destructive font-mono text-sm">SINAL FRACO / AMBIENTE ESCURO</p>
            <p className="text-muted-foreground font-mono text-xs mt-2">Aguardando melhor conexão...</p>
            
            {/* Static noise effect */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />
          </div>
        )}

        {/* REC indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-destructive font-mono text-xs">REC</span>
        </div>

        {/* Camera info */}
        <div className="absolute bottom-2 right-2 text-xs font-mono text-muted-foreground bg-black/50 px-2 py-1 rounded">
          CAM_FRONT_0
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all">
            FRONTAL
          </button>
          <button className="px-2 py-1 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all">
            TRASEIRA
          </button>
        </div>
        <span className="text-warning font-mono">480p</span>
      </div>
    </div>
  );
};

// 3. Audio Analyzer Module - Microphone eavesdropping
export const AudioAnalyzerModule = () => {
  const [captions, setCaptions] = useState<string[]>([]);
  const [waveform, setWaveform] = useState<number[]>(Array(30).fill(0));

  const fakeCaptions = [
    '[Ruído de fundo detectado]',
    '[Voz masculina identificada]',
    '[Analisando palavras-chave...]',
    '[Voz feminina detectada]',
    '[Conversa em andamento]',
    '[Ambiente: residencial]',
    '[Possível telefone tocando]',
    '[Digitação detectada]',
    '[Silêncio - aguardando...]',
    '[Música de fundo]',
  ];

  useEffect(() => {
    // Animate waveform
    const waveInterval = setInterval(() => {
      setWaveform(prev => prev.map(() => Math.random() * 100));
    }, 100);

    // Add captions periodically
    const captionInterval = setInterval(() => {
      setCaptions(prev => {
        const newCaption = fakeCaptions[Math.floor(Math.random() * fakeCaptions.length)];
        const updated = [...prev, newCaption].slice(-3);
        return updated;
      });
    }, 2500);

    return () => {
      clearInterval(waveInterval);
      clearInterval(captionInterval);
    };
  }, []);

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="text-primary">
          <Mic className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Analisador de Áudio
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary font-mono">GRAVANDO</span>
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="flex-1 relative bg-background/50 rounded border border-border p-4 min-h-[120px]">
        <div className="flex items-end justify-around h-full gap-0.5">
          {waveform.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-primary/50 to-primary transition-all duration-100 rounded-t"
              style={{ height: `${Math.max(5, height)}%` }}
            />
          ))}
        </div>
        
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
        
        {/* dB meter */}
        <div className="absolute top-2 right-2 font-mono text-xs">
          <span className="text-primary">{Math.floor(Math.random() * 30 + 40)} dB</span>
        </div>
      </div>

      {/* Live captions */}
      <div className="mt-3 p-2 bg-muted/20 border border-border min-h-[60px] font-mono text-xs space-y-1">
        <p className="text-muted-foreground text-[10px] uppercase mb-1">Transcrição ao Vivo:</p>
        {captions.map((caption, i) => (
          <p key={i} className="text-secondary animate-fade-in">
            {caption}
          </p>
        ))}
        {captions.length === 0 && (
          <p className="text-muted-foreground animate-pulse">Aguardando áudio...</p>
        )}
      </div>

      {/* Status */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Microfone: Ambiente</span>
        <span className="text-primary font-mono">44.1kHz</span>
      </div>
    </div>
  );
};

// 4. Keylogger Module - Typing capture
export const KeyloggerModule = () => {
  const [currentText, setCurrentText] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  
  const fakeMessages = [
    'Onde você está?',
    'Não posso falar agora',
    'Apaga isso antes que vejam',
    'Te ligo mais tarde ok',
    'Senha: ********',
    'Não conta pra ninguém',
    'Amanhã às 15h no lugar',
    'Chegou o pix?',
    'Preciso de ajuda urgente',
    'Delete essa conversa',
  ];

  useEffect(() => {
    let messageIndex = 0;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      const currentMessage = fakeMessages[messageIndex];
      
      if (charIndex < currentMessage.length) {
        setCurrentText(prev => prev + currentMessage[charIndex]);
        playKeystroke();
        charIndex++;
      } else {
        // Message complete, add to lines and start new one
        setLines(prev => [...prev.slice(-4), currentMessage]);
        setCurrentText('');
        charIndex = 0;
        messageIndex = (messageIndex + 1) % fakeMessages.length;
      }
    }, 150 + Math.random() * 100);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="text-warning">
          <Keyboard className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Keylogger Ativo
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          <span className="text-xs text-warning font-mono">CAPTURANDO</span>
        </div>
      </div>

      {/* Terminal display */}
      <div className="flex-1 bg-black rounded border border-border p-3 font-mono text-sm min-h-[140px] overflow-hidden">
        {/* Previous lines */}
        <div className="space-y-1 text-muted-foreground text-xs mb-2">
          {lines.map((line, i) => (
            <p key={i} className="opacity-60">{'>'} {line}</p>
          ))}
        </div>
        
        {/* Current typing */}
        <div className="flex items-center text-primary">
          <span className="text-secondary mr-1">{'>'}</span>
          <span>{currentText}</span>
          <span className="animate-typing-cursor ml-0.5 w-2 h-4 bg-primary" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between p-2 bg-muted/20 border border-border">
          <span className="text-muted-foreground">Teclas:</span>
          <span className="text-primary font-mono">1,847</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-muted/20 border border-border">
          <span className="text-muted-foreground">Sessão:</span>
          <span className="text-secondary font-mono">02:34:12</span>
        </div>
      </div>
    </div>
  );
};

// 5. Media Gallery Module - Blurred photos/videos
export const MediaGalleryModule = () => {
  const mediaItems = [
    { type: 'photo', date: 'Hoje, 14:32', hot: false },
    { type: 'video', date: 'Hoje, 11:15', hot: true },
    { type: 'photo', date: 'Ontem, 22:48', hot: true },
    { type: 'video', date: 'Ontem, 19:03', hot: false },
    { type: 'photo', date: '02/01, 16:22', hot: false },
    { type: 'photo', date: '02/01, 09:45', hot: true },
  ];

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="text-secondary">
          <Image className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Galeria de Mídia
        </h3>
        <div className="ml-auto text-xs text-muted-foreground">
          {mediaItems.length} arquivos
        </div>
      </div>

      {/* Media grid */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {mediaItems.map((item, i) => (
          <div 
            key={i} 
            className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 border border-border rounded overflow-hidden group cursor-pointer"
          >
            {/* Blurred content simulation */}
            <div className="absolute inset-0 blur-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-warning/20" />
            
            {/* Type indicator */}
            <div className="absolute top-1 left-1 z-10">
              {item.type === 'video' ? (
                <div className="w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-white" fill="white" />
                </div>
              ) : null}
            </div>
            
            {/* Hot indicator */}
            {item.hot && (
              <div className="absolute top-1 right-1 z-10">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              </div>
            )}
            
            {/* Date */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[8px] text-muted-foreground text-center py-0.5 font-mono">
              {item.date}
            </div>
            
            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
              <Lock className="w-6 h-6 text-warning" />
            </div>
          </div>
        ))}
      </div>

      {/* Unlock button */}
      <button className="mt-3 w-full py-2 border-2 border-warning text-warning text-xs font-mono uppercase hover:bg-warning hover:text-background transition-all flex items-center justify-center gap-2">
        <Lock className="w-3 h-3" />
        Desbloquear Mídia - R$ 149,90
      </button>
    </div>
  );
};

// 6. Target Status Module - Battery & Network
export const TargetStatusModule = () => {
  const [battery, setBattery] = useState(14);
  const [networkStrength, setNetworkStrength] = useState(2);

  useEffect(() => {
    // Slowly decrease battery
    const batteryInterval = setInterval(() => {
      setBattery(prev => Math.max(1, prev - 1));
    }, 30000);

    // Fluctuate network
    const networkInterval = setInterval(() => {
      setNetworkStrength(Math.floor(Math.random() * 3) + 1);
    }, 5000);

    return () => {
      clearInterval(batteryInterval);
      clearInterval(networkInterval);
    };
  }, []);

  return (
    <div className="module-card cut-corners-lg p-4">
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
        <Signal className="w-4 h-4" />
        Status do Dispositivo Alvo
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Battery */}
        <div className="p-2 bg-muted/20 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Battery className={`w-4 h-4 ${battery < 20 ? 'text-destructive' : 'text-primary'}`} />
            <span className="text-xs text-muted-foreground">Bateria</span>
          </div>
          <p className={`text-lg font-mono font-bold ${battery < 20 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
            {battery}%
          </p>
          {battery < 20 && (
            <p className="text-[10px] text-destructive">Bateria crítica!</p>
          )}
        </div>
        
        {/* Network */}
        <div className="p-2 bg-muted/20 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Rede</span>
          </div>
          <p className="text-sm font-mono text-secondary">
            {networkStrength === 3 ? 'Wi-Fi' : '4G'}
          </p>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`w-1 rounded-sm ${i <= networkStrength ? 'bg-secondary' : 'bg-muted'}`}
                style={{ height: `${i * 4}px` }}
              />
            ))}
            <span className="text-[10px] text-warning ml-2">Instável</span>
          </div>
        </div>
      </div>

      {/* Last seen */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Última sincronização:</span>
        <span className="text-primary font-mono">há 2 segundos</span>
      </div>
    </div>
  );
};

// 7. Command Console Module - Matrix style
export const CommandConsoleModule = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fakeCommands = [
    '> Initiating handshake...',
    '> TCP/IP: 192.168.1.███',
    '> Ping: 23ms',
    '> Handshake accepted',
    '> Bypassing firewall...',
    '> SSL certificate: SPOOFED',
    '> Injecting payload...',
    '> Memory dump: 0x7fff████',
    '> Root access: GRANTED',
    '> Extracting data...',
    '> Hash: e3b0c44298fc1c149afb████',
    '> Connection: ENCRYPTED',
    '> Proxy chain: 3 nodes',
    '> Tor exit: DE-███',
    '> VPN tunnel: ACTIVE',
    '> Keylogger: INJECTED',
    '> Microphone: LISTENING',
    '> Camera: STREAMING',
    '> GPS: TRACKING',
    '> SMS: INTERCEPTED',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCommand = fakeCommands[Math.floor(Math.random() * fakeCommands.length)];
      setLogs(prev => [...prev.slice(-15), randomCommand]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="module-card cut-corners-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="text-primary">
          <Terminal className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-primary text-glow uppercase tracking-wider">
          Console de Comandos
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>
      </div>

      {/* Console output */}
      <div 
        ref={containerRef}
        className="flex-1 bg-black rounded border border-primary/30 p-2 font-mono text-[10px] overflow-hidden min-h-[150px]"
        style={{ scrollBehavior: 'smooth' }}
      >
        {logs.map((log, i) => (
          <p 
            key={i} 
            className={`${
              log.includes('GRANTED') || log.includes('accepted') 
                ? 'text-primary' 
                : log.includes('Bypassing') || log.includes('Injecting')
                ? 'text-warning'
                : log.includes('ACTIVE') || log.includes('ENCRYPTED')
                ? 'text-secondary'
                : 'text-primary/70'
            }`}
          >
            {log}
          </p>
        ))}
        <p className="text-primary animate-pulse">{'>'} _</p>
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>SYSTEM v3.7.2</span>
        <span className="text-primary">PID: {Math.floor(Math.random() * 9000) + 1000}</span>
      </div>
    </div>
  );
};
