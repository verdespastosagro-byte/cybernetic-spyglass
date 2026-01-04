import { Eye, Shield, Lock, UserPlus, ArrowLeft, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { playBootSound, playSuccessBeep, playKeystroke, playErrorAlarm, playWarningBeep } from '@/lib/sounds';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

interface StoredUser {
  agentId: string;
  password: string;
  name: string;
  createdAt: string;
}

const generateAgentId = (): string => {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `AGT-${number}`;
};

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'success'>('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if there's a stored user
    const storedUser = localStorage.getItem('sentinela_user');
    if (storedUser) {
      const user: StoredUser = JSON.parse(storedUser);
      setUserId(user.agentId);
    }
  }, []);

  const handleLogin = () => {
    if (!userId.trim() || !password.trim()) {
      setError('ERRO: PREENCHA TODOS OS CAMPOS');
      playWarningBeep();
      return;
    }
    
    const storedUser = localStorage.getItem('sentinela_user');
    if (!storedUser) {
      setError('ERRO: USUÁRIO NÃO ENCONTRADO. SOLICITE ACESSO PRIMEIRO.');
      playErrorAlarm();
      return;
    }

    const user: StoredUser = JSON.parse(storedUser);
    
    if (userId.toUpperCase() !== user.agentId || password !== user.password) {
      setError('ERRO: CREDENCIAIS INVÁLIDAS. ACESSO NEGADO.');
      playErrorAlarm();
      return;
    }

    playBootSound();
    setIsConnecting(true);
    setError('');
    
    setTimeout(() => {
      playSuccessBeep();
      onLogin(user.name);
    }, 2000);
  };

  const handleRegister = () => {
    if (!name.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('ERRO: PREENCHA TODOS OS CAMPOS');
      playWarningBeep();
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('ERRO: SENHAS NÃO COINCIDEM');
      playWarningBeep();
      return;
    }

    if (newPassword.length < 4) {
      setError('ERRO: SENHA DEVE TER NO MÍNIMO 4 CARACTERES');
      playWarningBeep();
      return;
    }

    const agentId = generateAgentId();
    const newUser: StoredUser = {
      agentId,
      password: newPassword,
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('sentinela_user', JSON.stringify(newUser));
    setGeneratedId(agentId);
    setError('');
    playSuccessBeep();
    setMode('success');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    playSuccessBeep();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToLogin = () => {
    setMode('login');
    setUserId(generatedId);
    setPassword('');
    setName('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    playKeystroke();
    setter(e.target.value);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 scanlines">
      {/* Background grid effect */}
      <div className="fixed inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(120 100% 55% / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(120 100% 55% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <Shield className="w-20 h-20 text-primary text-glow" strokeWidth={1} />
            <Eye className="w-10 h-10 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-glow-secondary" />
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold text-primary text-glow tracking-widest uppercase">
            SISTEMA SENTINELA
          </h1>
          <p className="text-sm text-destructive text-glow-destructive mt-2 tracking-wider uppercase animate-pulse-glow">
            ⚠ ACESSO RESTRITO ⚠
          </p>
        </div>

        {/* Success Screen - After Registration */}
        {mode === 'success' && (
          <div className="border-2 border-primary p-6 md:p-8 bg-card/80 backdrop-blur-sm border-glow cut-corners-lg">
            <div className="space-y-6 text-center">
              <div className="text-primary text-glow">
                <Check className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-lg uppercase tracking-wider mb-2">CADASTRO APROVADO</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  SEU ID DE AGENTE FOI GERADO:
                </p>
                
                <div className="relative">
                  <div className="bg-background border-2 border-secondary p-4 font-mono text-2xl text-secondary text-glow-secondary tracking-widest">
                    {generatedId}
                  </div>
                  <button
                    onClick={handleCopyId}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-secondary hover:text-primary transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                
                <p className="text-xs text-warning animate-pulse uppercase">
                  ⚠ ANOTE SEU ID - VOCÊ PRECISARÁ DELE PARA ACESSAR O SISTEMA ⚠
                </p>
              </div>

              <button
                onClick={handleBackToLogin}
                className="w-full py-4 font-mono text-sm uppercase tracking-widest font-bold
                  border-2 bg-primary/10 border-primary text-primary hover:bg-primary hover:text-background 
                  border-glow transition-all duration-300 cut-corners"
              >
                IR PARA LOGIN
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <div className="border-2 border-primary p-6 md:p-8 bg-card/80 backdrop-blur-sm border-glow cut-corners-lg">
            <div className="space-y-6">
              {/* User ID Field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {`> ID DO AGENTE`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userId}
                    onChange={handleInputChange(setUserId)}
                    placeholder="AGT-XXXX"
                    disabled={isConnecting}
                    className="input-cyber cut-corners-sm uppercase"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {`> CHAVE DE ACESSO (SENHA)`}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    placeholder="••••••••••••"
                    disabled={isConnecting}
                    className="input-cyber cut-corners-sm"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-destructive text-xs uppercase tracking-wider text-center animate-pulse">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={!userId.trim() || !password.trim() || isConnecting}
                className={`
                  w-full py-4 font-mono text-sm uppercase tracking-widest font-bold
                  border-2 transition-all duration-300 cut-corners
                  ${isConnecting 
                    ? 'bg-warning/20 border-warning text-warning cursor-wait' 
                    : 'bg-primary/10 border-primary text-primary hover:bg-primary hover:text-background border-glow'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">◐</span>
                    ESTABELECENDO CONEXÃO SEGURA...
                  </span>
                ) : (
                  'INICIAR CONEXÃO SEGURA'
                )}
              </button>

              {/* Register Link */}
              <button
                onClick={() => { setMode('register'); setError(''); }}
                disabled={isConnecting}
                className="w-full py-3 font-mono text-xs uppercase tracking-widest
                  border border-secondary/50 text-secondary hover:border-secondary hover:bg-secondary/10
                  transition-all duration-300 cut-corners flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                SOLICITAR ACESSO / CADASTRO
              </button>
            </div>
          </div>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <div className="border-2 border-secondary p-6 md:p-8 bg-card/80 backdrop-blur-sm border-glow-secondary cut-corners-lg">
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-secondary transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                VOLTAR AO LOGIN
              </button>

              <div className="text-center mb-4">
                <h2 className="text-lg text-secondary text-glow-secondary uppercase tracking-wider">
                  SOLICITAÇÃO DE ACESSO
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Um ID de agente será gerado automaticamente
                </p>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {`> NOME COMPLETO`}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleInputChange(setName)}
                  placeholder="Digite seu nome..."
                  className="input-cyber cut-corners-sm border-secondary focus:border-secondary"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {`> CRIAR SENHA`}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handleInputChange(setNewPassword)}
                    placeholder="Mínimo 4 caracteres"
                    className="input-cyber cut-corners-sm border-secondary focus:border-secondary"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                  {`> CONFIRMAR SENHA`}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleInputChange(setConfirmPassword)}
                    placeholder="Repita a senha"
                    className="input-cyber cut-corners-sm border-secondary focus:border-secondary"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-destructive text-xs uppercase tracking-wider text-center animate-pulse">
                  {error}
                </div>
              )}

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={!name.trim() || !newPassword.trim() || !confirmPassword.trim()}
                className="w-full py-4 font-mono text-sm uppercase tracking-widest font-bold
                  border-2 bg-secondary/10 border-secondary text-secondary hover:bg-secondary hover:text-background 
                  border-glow-secondary transition-all duration-300 cut-corners
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                GERAR ID DE AGENTE
              </button>
            </div>
          </div>
        )}

        {/* Warning Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-destructive animate-blink uppercase tracking-wider">
            ⚡ Tentativas de acesso não autorizado serão rastreadas ⚡
          </p>
        </div>

        {/* Connection Info */}
        <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
          <span>PROTOCOLO: TLS 1.3</span>
          <span>CRIPTOGRAFIA: AES-256</span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;