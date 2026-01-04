import { useState, useCallback } from 'react';
import TerminalInput from './TerminalInput';
import TerminalSelect from './TerminalSelect';
import ActionButton from './ActionButton';
import ProgressBar from './ProgressBar';
import TerminalOutput from './TerminalOutput';
import { 
  playBeep, 
  playSuccessBeep, 
  playWarningBeep, 
  playErrorAlarm, 
  playDataSound,
  playBootSound 
} from '@/lib/sounds';

const OPERATION_TYPES = [
  { value: 'gps', label: 'Rastrear Localização GPS' },
  { value: 'chat', label: 'Interceptar Conversas (Chat Log)' },
  { value: 'data', label: 'Varredura de Dados Pessoais' },
  { value: 'fidelity', label: 'Análise de Fidelidade' },
];

const FAKE_TERMINAL_LINES = [
  { text: '[*] Inicializando conexão segura...', sound: 'beep' },
  { text: '[+] Conectando ao nó seguro 192.168.45.127...', sound: 'success' },
  { text: '[+] Handshake SSL estabelecido', sound: 'success' },
  { text: '[*] Verificando credenciais de acesso...', sound: 'beep' },
  { text: '[!] Bypassing firewall corporativo...', sound: 'warning' },
  { text: '[+] Firewall bypassed com sucesso', sound: 'success' },
  { text: '[*] Acessando servidor proxy 10.0.0.45...', sound: 'beep' },
  { text: '[+] Rota alternativa estabelecida', sound: 'success' },
  { text: '[!] Injetando exploit CVE-2024-1337...', sound: 'warning' },
  { text: '[*] Aguardando resposta do servidor...', sound: 'beep' },
  { text: '[+] Exploit injetado com sucesso', sound: 'success' },
  { text: '[*] Triangulando sinal de GPS...', sound: 'beep' },
  { text: '[+] Satélite NORAD-7 conectado', sound: 'success' },
  { text: '[*] Descriptografando pacotes de dados...', sound: 'data' },
  { text: '[!] Baixando pacotes criptografados [15%]...', sound: 'data' },
  { text: '[+] Baixando pacotes criptografados [32%]...', sound: 'data' },
  { text: '[*] Baixando pacotes criptografados [47%]...', sound: 'data' },
  { text: '[+] Baixando pacotes criptografados [63%]...', sound: 'data' },
  { text: '[!] Baixando pacotes criptografados [78%]...', sound: 'data' },
  { text: '[+] Baixando pacotes criptografados [89%]...', sound: 'data' },
  { text: '[*] Baixando pacotes criptografados [95%]...', sound: 'data' },
  { text: '[+] Baixando pacotes criptografados [99%]...', sound: 'data' },
  { text: '[!] Verificando integridade dos dados...', sound: 'warning' },
  { text: '[*] Processando informações do alvo...', sound: 'beep' },
  { text: '[+] Acessando banco de dados central...', sound: 'success' },
  { text: '[*] Consultando registros classificados...', sound: 'beep' },
];

const playLineSound = (sound: string) => {
  switch (sound) {
    case 'beep':
      playBeep();
      break;
    case 'success':
      playSuccessBeep();
      break;
    case 'warning':
      playWarningBeep();
      break;
    case 'data':
      playDataSound();
      break;
  }
};

const SurveillancePanel = () => {
  const [targetName, setTargetName] = useState('');
  const [operationType, setOperationType] = useState('gps');
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showError, setShowError] = useState(false);

  const startProtocol = useCallback(() => {
    if (!targetName.trim()) return;

    // Play boot sound when starting
    playBootSound();

    setIsProcessing(true);
    setTerminalLines([]);
    setProgress(0);
    setShowProgress(true);
    setShowError(false);

    // Initial line with target info
    setTimeout(() => {
      playSuccessBeep();
      setTerminalLines([`[+] ALVO IDENTIFICADO: ${targetName.toUpperCase()}`]);
    }, 300);
    
    setTimeout(() => {
      playBeep();
      setTerminalLines(prev => [...prev, `[*] OPERAÇÃO: ${OPERATION_TYPES.find(o => o.value === operationType)?.label}`]);
    }, 600);
    
    setTimeout(() => {
      setTerminalLines(prev => [...prev, '']);
    }, 800);

    let lineIndex = 0;
    const totalDuration = 10000; // 10 seconds
    const lineInterval = totalDuration / FAKE_TERMINAL_LINES.length;

    const lineTimer = setInterval(() => {
      if (lineIndex < FAKE_TERMINAL_LINES.length) {
        const line = FAKE_TERMINAL_LINES[lineIndex];
        playLineSound(line.sound);
        setTerminalLines(prev => [...prev, line.text]);
        lineIndex++;
      }
    }, lineInterval);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 100));
        return Math.min(newProgress, 99);
      });
    }, 100);

    // Final result after 10 seconds
    setTimeout(() => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      setProgress(100);
      setShowProgress(false);
      setIsProcessing(false);
      setShowError(true);
      // Play error alarm
      playErrorAlarm();
    }, totalDuration);
  }, [targetName, operationType]);

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
      {/* Panel container */}
      <div className="border-2 border-primary p-6 md:p-8 bg-card/50 backdrop-blur-sm border-glow">
        {/* Panel header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-primary text-glow uppercase tracking-widest">
            ◆ PAINEL DE VIGILÂNCIA ◆
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Form */}
        <div className="space-y-6">
          <TerminalInput
            label="INSERIR NOME DO ALVO OU ID:"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="Digite o identificador do alvo..."
            disabled={isProcessing}
          />

          <TerminalSelect
            label="TIPO DE OPERAÇÃO:"
            value={operationType}
            onChange={setOperationType}
            options={OPERATION_TYPES}
          />

          <ActionButton
            isProcessing={isProcessing}
            onClick={startProtocol}
            disabled={!targetName.trim()}
          />

          <ProgressBar progress={progress} isVisible={showProgress} />

          <TerminalOutput
            lines={terminalLines}
            isProcessing={isProcessing}
            showError={showError}
          />
        </div>
      </div>

      {/* Footer warning */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          ⚡ SISTEMA MONITORADO ⚡ TODAS AS AÇÕES SÃO REGISTRADAS
        </p>
      </div>
    </div>
  );
};

export default SurveillancePanel;