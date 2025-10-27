import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, TestTube } from 'lucide-react';

export const EmailTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const testEmail = async () => {
    setTesting(true);
    try {
      const testData = {
        name: 'Test Kunde',
        email: 'test@example.com',
        phone: '+49 123 456789',
        address: 'Teststraße 1, 12345 Teststadt',
        bestellung: [
          { produkt: 'Test Rehkeule', preis: 18.50, menge: 1 },
          { produkt: 'Test Wildbratwurst', preis: 9.00, menge: 2 }
        ],
        gesamtpreis: '36.50',
        nachricht: 'Dies ist eine Test-Bestellung zur Überprüfung des E-Mail-Systems.'
      };

      console.log('Sending test email with data:', testData);

      const { data, error } = await supabase.functions.invoke('email_debug_test_2025_10_25_19_00', {
        body: testData
      });

      console.log('Response data:', data);
      console.log('Response error:', error);

      setLastResult({ data, error, timestamp: new Date().toISOString() });

      if (error) {
        throw new Error(error.message || 'Fehler beim Aufrufen der E-Mail-Funktion');
      }

      if (data?.error) {
        throw new Error(data.details || data.error || 'E-Mail-Service Fehler');
      }

      toast({
        title: "Test erfolgreich",
        description: data?.success ? 
          `E-Mail gesendet! Order ID: ${data.order_id}` : 
          "Test abgeschlossen - siehe Debug-Informationen",
      });

    } catch (error: any) {
      console.error('Test error:', error);
      setLastResult({ error: error.message, timestamp: new Date().toISOString() });
      
      toast({
        title: "Test fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            E-Mail System Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Testen Sie das E-Mail-System mit einer Beispiel-Bestellung.
          </p>
          
          <Button 
            onClick={testEmail} 
            disabled={testing}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            {testing ? 'Teste E-Mail-System...' : 'E-Mail-System testen'}
          </Button>

          {lastResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Letztes Test-Ergebnis:</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                {JSON.stringify(lastResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};