import { useState, useEffect } from 'react';
import { Lock, Copy, Check, AlertTriangle, Shield, Clock, CreditCard, ExternalLink } from 'lucide-react';
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

  // Kiwify checkout URL
  const defaultKiwifyUrl = 'https://pay.kiwify.com.br/8zPiNDF';

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
              Relatório de Inteligência
            </h2>
            <p className="text-sm text-muted-foreground">
              Desbloqueie os dados ocultos deste número agora.
            </p>
          </div>

          {/* Target Info */}
          <div className="bg-muted/20 border border-border p-3 mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Número do Alvo:</span>
              <span className="text-destructive font-mono">{targetPhone}</span>
            </div>
            {targetName && (
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Nome Detectado:</span>
                <span className="text-primary font-mono">{targetName}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-warning font-mono flex items-center gap-1">
                <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                DADOS BLOQUEADOS
              </span>
            </div>
          </div>

          {/* What's included */}
          <div className="mb-4">
            <p className="text-xs text-primary uppercase mb-3 font-bold tracking-wider text-center">
              🔓 O que este relatório único inclui:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-primary/5 border border-primary/30">
                <span className="text-primary">📍</span>
                <div>
                  <span className="text-foreground text-sm font-medium">Localização em Tempo Real</span>
                  <p className="text-xs text-muted-foreground">GPS visual com mapa interativo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-secondary/5 border border-secondary/30">
                <span className="text-secondary">💬</span>
                <div>
                  <span className="text-foreground text-sm font-medium">Histórico de Conversas</span>
                  <p className="text-xs text-muted-foreground">Recuperação de mensagens</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-pink-500/5 border border-pink-500/30">
                <span className="text-pink-500">📋</span>
                <div>
                  <span className="text-foreground text-sm font-medium">Dados de Cadastro</span>
                  <p className="text-xs text-muted-foreground">Informações vinculadas ao número</p>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-muted/10 border border-border/50 p-3 mb-4 text-xs">
            <p className="text-primary font-bold uppercase mb-2">⚡ Como funciona:</p>
            <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Realize o pagamento via PIX ou Kiwify</li>
              <li>Clique em "Já Paguei" para liberar</li>
              <li>Os dados aparecem na tela imediatamente</li>
            </ol>
            <p className="mt-2 text-xs text-warning">✓ Consulta única • Anônimo • Imediato</p>
          </div>

          {/* Price */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Consulta Única</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg text-muted-foreground line-through">R$ 49,90</span>
              <p className="text-4xl font-bold text-primary" style={{ textShadow: '0 0 30px hsl(120 100% 55%)' }}>
                R$ 14,90
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pagamento único • Sem assinatura</p>
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
