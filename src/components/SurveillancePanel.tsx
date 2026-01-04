import { useState, useCallback } from 'react';
import TerminalInput from './TerminalInput';
import TerminalSelect from './TerminalSelect';
import ActionButton from './ActionButton';
import ProgressBar from './ProgressBar';
import TerminalOutput from './TerminalOutput';

const OPERATION_TYPES = [
  { value: 'gps', label: 'Rastrear Localização GPS' },
  { value: 'chat', label: 'Interceptar Conversas (Chat Log)' },
  { value: 'data', label: 'Varredura de Dados Pessoais' },
  { value: 'fidelity', label: 'Análise de Fidelidade' },
];

const FAKE_TERMINAL_LINES = [
  '[*] Inicializando conexão segura...',
  '[+] Conectando ao nó seguro 192.168.45.127...',
  '[+] Handshake SSL estabelecido',
  '[*] Verificando credenciais de acesso...',
  '[!] Bypassing firewall corporativo...',
  '[+] Firewall bypassed com sucesso',
  '[*] Acessando servidor proxy 10.0.0.45...',
  '[+] Rota alternativa estabelecida',
  '[!] Injetando exploit CVE-2024-1337...',
  '[*] Aguardando resposta do servidor...',
  '[+] Exploit injetado com sucesso',
  '[*] Triangulando sinal de GPS...',
  '[+] Satélite NORAD-7 conectado',
  '[*] Descriptografando pacotes de dados...',
  '[!] Baixando pacotes criptografados [15%]...',
  '[+] Baixando pacotes criptografados [32%]...',
  '[*] Baixando pacotes criptografados [47%]...',
  '[+] Baixando pacotes criptografados [63%]...',
  '[!] Baixando pacotes criptografados [78%]...',
  '[+] Baixando pacotes criptografados [89%]...',
  '[*] Baixando pacotes criptografados [95%]...',
  '[+] Baixando pacotes criptografados [99%]...',
  '[!] Verificando integridade dos dados...',
  '[*] Processando informações do alvo...',
  '[+] Acessando banco de dados central...',
  '[*] Consultando registros classificados...',
];

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

    setIsProcessing(true);
    setTerminalLines([]);
    setProgress(0);
    setShowProgress(true);
    setShowError(false);

    // Initial line with target info
    setTerminalLines([`[+] ALVO IDENTIFICADO: ${targetName.toUpperCase()}`]);
    setTerminalLines(prev => [...prev, `[*] OPERAÇÃO: ${OPERATION_TYPES.find(o => o.value === operationType)?.label}`]);
    setTerminalLines(prev => [...prev, '']);

    let lineIndex = 0;
    const totalDuration = 10000; // 10 seconds
    const lineInterval = totalDuration / FAKE_TERMINAL_LINES.length;

    const lineTimer = setInterval(() => {
      if (lineIndex < FAKE_TERMINAL_LINES.length) {
        setTerminalLines(prev => [...prev, FAKE_TERMINAL_LINES[lineIndex]]);
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
