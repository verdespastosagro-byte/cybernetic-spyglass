import { useState, useEffect } from 'react';
import { 
  Phone, 
  Search, 
  Shield, 
  Lock, 
  Wifi, 
  Radio,
  Satellite,
  Server,
  Fingerprint,
  Eye,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Database
} from 'lucide-react';
import { playKeystroke, playWarningBeep, playSuccessBeep, playErrorAlarm } from '@/lib/sounds';
import MatrixRain from './MatrixRain';
import { generateFakePersonData, FakePersonData } from '@/lib/fakeDataGenerator';

interface TargetSearchScreenProps {
  onTargetFound: (phoneNumber: string, personData: FakePersonData) => void;
  onCancel: () => void;
}

const TargetSearchScreen = ({ onTargetFound, onCancel }: TargetSearchScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stage, setStage] = useState<'input' | 'processing' | 'dataLookup' | 'connecting'>('input');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [personData, setPersonData] = useState<FakePersonData | null>(null);
  const [dataLookupProgress, setDataLookupProgress] = useState(0);

  const processingSteps = [
    { text: 'Iniciando protocolo SENTINEL...', delay: 300 },
    { text: 'Conectando à rede TOR...', delay: 400 },
    { text: 'Bypass de firewall ativo...', delay: 500 },
    { text: 'Triangulando sinal do dispositivo...', delay: 600 },
    { text: 'IMEI detectado: ████████████████', delay: 400 },
    { text: 'Verificando operadora de rede...', delay: 300 },
    { text: 'Operadora: VIVO/TIM/CLARO', delay: 200 },
    { text: 'Quebrando criptografia SSL...', delay: 700 },
    { text: 'Injetando payload de monitoramento...', delay: 500 },
    { text: 'Estabelecendo conexão P2P segura...', delay: 400 },
    { text: 'Sincronizando dados do WhatsApp...', delay: 600 },
    { text: 'Acessando banco de dados do Instagram...', delay: 500 },
    { text: 'Ativando GPS tracker remoto...', delay: 400 },
    { text: 'Habilitando captura de tela...', delay: 300 },
    { text: 'Interceptando microfone ambiente...', delay: 500 },
    { text: 'ROOT ACCESS: GRANTED', delay: 200 },
    { text: '⚠️ DISPOSITIVO COMPROMETIDO', delay: 300 },
    { text: 'CONEXÃO ESTABELECIDA COM SUCESSO!', delay: 0 },
  ];

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

  const handleSubmit = () => {
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      playWarningBeep();
      return;
    }

    playSuccessBeep();
    setStage('processing');
    setTerminalLines([]);
    setCurrentStep(0);
    setProgress(0);
  };

  // Processing animation
  useEffect(() => {
    if (stage !== 'processing') return;

    const runProcessing = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, processingSteps[i].delay));
        
        setTerminalLines(prev => [...prev, processingSteps[i].text]);
        setCurrentStep(i + 1);
        setProgress(((i + 1) / processingSteps.length) * 100);

        // Play sounds at certain steps
        if (i === 5 || i === 10) playSuccessBeep();
        if (i === 15) playWarningBeep();
      }

      // Generate fake person data
      const fakeData = generateFakePersonData(phoneNumber);
      setPersonData(fakeData);

      // Move to data lookup stage
      await new Promise(resolve => setTimeout(resolve, 500));
      playSuccessBeep();
      setStage('dataLookup');
    };

    runProcessing();
  }, [stage, phoneNumber]);

  // Data lookup animation
  useEffect(() => {
    if (stage !== 'dataLookup') return;

    const runDataLookup = async () => {
      // Animate progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setDataLookupProgress(i);
        if (i === 50) playSuccessBeep();
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      playSuccessBeep();
      setStage('connecting');
      
      // Transition to dashboard
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (personData) {
        onTargetFound(phoneNumber, personData);
      }
    };

    runDataLookup();
  }, [stage, phoneNumber, personData, onTargetFound]);

  // Data lookup screen
  if (stage === 'dataLookup' && personData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <MatrixRain />
        
        <div className="relative z-10 w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary text-secondary text-xs uppercase tracking-wider mb-4">
              <Database className="w-4 h-4 animate-pulse" />
              <span>Consultando Bases de Dados</span>
            </div>
            
            <h2 className="text-xl font-bold text-primary text-glow uppercase tracking-widest">
              Dados do Titular
            </h2>
            <p className="text-secondary font-mono text-lg mt-2">{phoneNumber}</p>
          </div>

          {/* Data card */}
          <div className="bg-background/80 border-2 border-primary/50 p-6 space-y-4">
            {/* Name */}
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border">
              <User className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase">Nome Completo</p>
                <p className="text-sm font-mono text-foreground">
                  {dataLookupProgress >= 30 ? personData.blurredName : '████████████████'}
                </p>
              </div>
              {dataLookupProgress >= 30 && (
                <span className="text-xs text-primary font-mono">ENCONTRADO</span>
              )}
            </div>

            {/* CPF */}
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border">
              <CreditCard className="w-5 h-5 text-secondary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase">CPF</p>
                <p className="text-sm font-mono text-foreground">
                  {dataLookupProgress >= 50 ? personData.cpf : '███.███.███-██'}
                </p>
              </div>
              {dataLookupProgress >= 50 && (
                <span className="text-xs text-secondary font-mono">PARCIAL</span>
              )}
            </div>

            {/* Birth Date */}
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border">
              <Calendar className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase">Data de Nascimento</p>
                <p className="text-sm font-mono text-foreground">
                  {dataLookupProgress >= 70 ? personData.blurredBirthDate : '██/██/████'}
                </p>
              </div>
              {dataLookupProgress >= 70 && (
                <span className="text-xs text-warning font-mono">~{personData.age} ANOS</span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border">
              <MapPin className="w-5 h-5 text-destructive" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase">Localização</p>
                <p className="text-sm font-mono text-foreground">
                  {dataLookupProgress >= 90 ? `${personData.blurredCity} - ${personData.state}` : '████████████ - ██'}
                </p>
              </div>
              {dataLookupProgress >= 90 && (
                <span className="text-xs text-destructive font-mono">{personData.operator}</span>
              )}
            </div>

            {/* Progress */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Consultando bases: SERASA, RECEITA, SPC, ANATEL
                </span>
                <span className="text-primary font-mono">{dataLookupProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300"
                  style={{ width: `${dataLookupProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              ⚠️ Dados parcialmente ocultados por segurança
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'connecting') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Eye className="w-16 h-16 text-primary animate-bounce" />
            </div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-secondary rounded-full mx-auto animate-ping opacity-30" />
          </div>
          
          <h2 className="text-2xl font-bold text-primary text-glow uppercase tracking-widest mb-2">
            Dispositivo Comprometido
          </h2>
          <p className="text-secondary font-mono text-lg mb-2">{phoneNumber}</p>
          {personData && (
            <p className="text-primary font-mono text-sm mb-4">
              {personData.blurredName}
            </p>
          )}
          <p className="text-muted-foreground text-sm animate-pulse">
            Carregando painel de monitoramento...
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <MatrixRain />
        
        <div className="relative z-10 w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive text-destructive text-xs uppercase tracking-wider mb-4">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span>Invasão em Progresso</span>
            </div>
            
            <h2 className="text-xl font-bold text-primary text-glow uppercase tracking-widest">
              Comprometendo Dispositivo
            </h2>
            <p className="text-secondary font-mono text-lg mt-2">{phoneNumber}</p>
          </div>

          {/* Progress indicators */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { icon: Radio, label: 'Sinal', active: currentStep > 3 },
              { icon: Lock, label: 'SSL', active: currentStep > 7 },
              { icon: Server, label: 'Servidor', active: currentStep > 11 },
              { icon: Fingerprint, label: 'Acesso', active: currentStep > 15 },
            ].map(({ icon: Icon, label, active }, i) => (
              <div 
                key={label}
                className={`p-3 border text-center transition-all ${
                  active 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-muted/20 border-border text-muted-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-1 ${active ? 'animate-pulse' : ''}`} />
                <p className="text-xs uppercase">{label}</p>
                <p className="text-xs font-mono">{active ? 'OK' : '...'}</p>
              </div>
            ))}
          </div>

          {/* Terminal */}
          <div className="bg-background/80 border-2 border-primary/50 p-4 font-mono text-xs max-h-64 overflow-y-auto">
            <div className="flex items-center gap-2 text-primary mb-3 pb-2 border-b border-border">
              <Server className="w-4 h-4" />
              <span>SENTINEL_TERMINAL v3.7.2</span>
            </div>
            
            {terminalLines.map((line, i) => (
              <div 
                key={i}
                className={`py-0.5 ${
                  line.includes('GRANTED') || line.includes('SUCESSO') 
                    ? 'text-primary' 
                    : line.includes('⚠️') 
                      ? 'text-destructive animate-pulse' 
                      : 'text-secondary'
                }`}
              >
                <span className="text-muted-foreground">{'>'}</span> {line}
              </div>
            ))}
            
            {currentStep < processingSteps.length && (
              <div className="text-primary animate-pulse">
                <span className="text-muted-foreground">{'>'}</span> _
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso da invasão</span>
              <span className="text-primary font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Warning */}
          <div className="mt-6 text-center">
            <p className="text-xs text-destructive animate-pulse">
              ⚠️ NÃO FECHE ESTA JANELA ⚠️
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Input stage
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <MatrixRain />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary text-primary text-xs uppercase tracking-wider mb-4">
            <Satellite className="w-4 h-4" />
            <span>Sistema Sentinel Ativo</span>
          </div>
          
          <h1 className="text-2xl font-bold text-primary text-glow uppercase tracking-widest mb-2">
            Iniciar Rastreamento
          </h1>
          <p className="text-sm text-muted-foreground">
            Insira o número do dispositivo alvo para iniciar a operação
          </p>
        </div>

        {/* Search Card */}
        <div className="module-card cut-corners-lg p-6">
          {/* Phone icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-primary rounded-full flex items-center justify-center bg-primary/10">
                <Phone className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Phone input */}
          <div className="mb-6">
            <label className="block text-xs text-muted-foreground uppercase mb-2 tracking-wider">
              Número do Celular (com DDD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">+55</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                className="w-full pl-14 pr-4 py-4 bg-muted/20 border-2 border-primary/50 focus:border-primary text-foreground font-mono text-lg placeholder:text-muted-foreground focus:outline-none transition-all"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Funciona com qualquer operadora: VIVO, TIM, CLARO, OI
            </p>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            {[
              { icon: '📱', text: 'WhatsApp' },
              { icon: '📸', text: 'Instagram' },
              { icon: '📍', text: 'Localização GPS' },
              { icon: '🎤', text: 'Microfone' },
              { icon: '📷', text: 'Câmeras' },
              { icon: '⌨️', text: 'Keylogger' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 p-2 bg-muted/30 border border-border/50">
                <span>{icon}</span>
                <span className="text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={phoneNumber.replace(/\D/g, '').length < 10}
            className="w-full py-4 font-mono text-sm uppercase tracking-wider font-bold border-2 bg-primary/10 border-primary text-primary hover:bg-primary hover:text-background disabled:opacity-50 disabled:cursor-not-allowed cut-corners-sm flex items-center justify-center gap-2 transition-all"
          >
            <Search className="w-5 h-5" />
            Iniciar Rastreamento
          </button>

          {/* Security indicators */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              <span>Anônimo</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-secondary" />
              <span>Criptografado</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-primary" />
              <span>VPN</span>
            </div>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={onCancel}
          className="w-full mt-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
        >
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default TargetSearchScreen;
