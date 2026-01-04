import { Eye, Shield, Lock } from 'lucide-react';
import { useState } from 'react';
import { playBootSound, playSuccessBeep, playKeystroke } from '@/lib/sounds';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLogin = () => {
    if (!userId.trim()) return;
    
    playBootSound();
    setIsConnecting(true);
    
    setTimeout(() => {
      playSuccessBeep();
      onLogin(userId);
    }, 2000);
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    playKeystroke();
    setter(e.target.value);
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
            {/* Eye icon inside shield */}
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

        {/* Login Form */}
        <div className="border-2 border-primary p-6 md:p-8 bg-card/80 backdrop-blur-sm border-glow cut-corners-lg">
          <div className="space-y-6">
            {/* User ID Field */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                {`> ID DO USUÁRIO`}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={handleInputChange(setUserId)}
                  placeholder="Digite seu ID de agente..."
                  disabled={isConnecting}
                  className="input-cyber cut-corners-sm"
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

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!userId.trim() || isConnecting}
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
          </div>
        </div>

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