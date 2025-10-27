import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const ResendTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const testResendAPI = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing Resend API...');
      
      const { data, error } = await supabase.functions.invoke('resend_api_test_2025_10_24_08_03', {
        body: {}
      });

      console.log('Test result:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        setResult({ 
          success: false, 
          error: 'Supabase Fehler', 
          details: error.message 
        });
        return;
      }

      setResult(data);

      if (data?.success) {
        toast({
          title: "API Test erfolgreich",
          description: "Resend API funktioniert korrekt",
        });
      } else {
        toast({
          title: "API Test fehlgeschlagen",
          description: data?.error || "Unbekannter Fehler",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Test error:', error);
      setResult({ 
        success: false, 
        error: 'Client Fehler', 
        details: error.message 
      });
      
      toast({
        title: "Test fehlgeschlagen",
        description: error.message || "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Resend API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testResendAPI} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Teste API...' : 'Resend API testen'}
          </Button>

          {result && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Test-Ergebnis:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-4">
            <p><strong>Dieser Test überprüft:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Ob der RESEND_API_KEY in Supabase verfügbar ist</li>
              <li>Ob die Resend API erreichbar ist</li>
              <li>Welche genaue Fehlermeldung zurückkommt</li>
              <li>API-Key Format und Länge</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};