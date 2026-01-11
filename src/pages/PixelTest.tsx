import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

// Declare fbq type for TypeScript
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

interface EventLog {
  event: string;
  timestamp: Date;
  params?: Record<string, unknown>;
}

const PixelTest = () => {
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const pixelId = '3784068465220935';

  const isPixelLoaded = typeof window !== 'undefined' && typeof window.fbq === 'function';

  const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (isPixelLoaded) {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
      setEventLogs(prev => [...prev, { event: eventName, timestamp: new Date(), params }]);
    }
  };

  const events = [
    {
      name: 'PageView',
      description: 'Visualização de página (dispara automaticamente)',
      params: undefined,
    },
    {
      name: 'InitiateCheckout',
      description: 'Início do checkout (dispara no PaywallScreen)',
      params: {
        content_name: 'Relatório de Inteligência',
        content_ids: ['teste-123'],
        value: 14.90,
        currency: 'BRL'
      },
    },
    {
      name: 'Purchase',
      description: 'Compra confirmada (dispara após pagamento)',
      params: {
        content_name: 'Relatório de Inteligência',
        content_ids: ['teste-123'],
        value: 14.90,
        currency: 'BRL'
      },
    },
    {
      name: 'Lead',
      description: 'Captação de lead',
      params: {
        content_name: 'Busca de Telefone',
      },
    },
    {
      name: 'ViewContent',
      description: 'Visualização de conteúdo',
      params: {
        content_name: 'Dashboard',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">🔍 Teste do Meta Pixel</h1>
          <p className="text-muted-foreground">Verifique se os eventos estão disparando corretamente</p>
        </div>

        {/* Pixel Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPixelLoaded ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Status do Pixel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pixel ID:</span>
              <Badge variant="outline" className="font-mono">{pixelId}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={isPixelLoaded ? "default" : "destructive"}>
                {isPixelLoaded ? '✅ Carregado' : '❌ Não carregado'}
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <a 
                href="https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Instalar Meta Pixel Helper (extensão Chrome)
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Test Events */}
        <Card>
          <CardHeader>
            <CardTitle>Testar Eventos</CardTitle>
            <CardDescription>
              Clique nos botões para disparar eventos de teste. Use a extensão Meta Pixel Helper para verificar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {events.map((event) => (
                <div 
                  key={event.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <Button 
                    onClick={() => trackEvent(event.name, event.params)}
                    disabled={!isPixelLoaded}
                    size="sm"
                  >
                    Disparar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card>
          <CardHeader>
            <CardTitle>Log de Eventos Disparados</CardTitle>
            <CardDescription>
              Histórico de eventos disparados nesta sessão
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum evento disparado ainda
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {eventLogs.map((log, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{log.event}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Como Verificar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Instale a extensão <strong>Meta Pixel Helper</strong> no Chrome</li>
              <li>Recarregue esta página</li>
              <li>Clique no ícone da extensão - deve mostrar o Pixel ID <code className="bg-muted px-1 rounded">{pixelId}</code></li>
              <li>Clique nos botões acima para disparar eventos</li>
              <li>A extensão mostrará cada evento em tempo real</li>
              <li>Verifique também no <strong>Gerenciador de Eventos</strong> do Meta</li>
            </ol>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <a href="/" className="text-primary hover:underline">
            ← Voltar para o sistema
          </a>
        </div>
      </div>
    </div>
  );
};

export default PixelTest;
