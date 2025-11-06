import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, ShoppingCart, AlertTriangle } from 'lucide-react';

export const ShopBestellVerwaltungDebug: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const testDatabaseConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing database connection...');
      
      // Test 1: Prüfe Tabellen-Existenz
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .like('table_name', '%bestellung%');
      
      console.log('Tables check:', { tables, tablesError });
      
      // Test 2: Versuche neue Tabelle zu lesen
      const { data: newTableData, error: newTableError } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .select('*')
        .limit(5);
      
      console.log('New table check:', { newTableData, newTableError });
      
      // Test 3: Versuche alte Tabelle zu lesen
      const { data: oldTableData, error: oldTableError } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .select('*')
        .limit(5);
      
      console.log('Old table check:', { oldTableData, oldTableError });
      
      // Test 4: Prüfe RLS Policies
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies_for_table', { table_name: 'simple_bestellungen_2025_11_06_21_00' })
        .single();
      
      console.log('Policies check:', { policies, policiesError });
      
      setDebugInfo({
        tables: tables || [],
        tablesError: tablesError?.message,
        newTable: {
          data: newTableData || [],
          error: newTableError?.message,
          count: newTableData?.length || 0
        },
        oldTable: {
          data: oldTableData || [],
          error: oldTableError?.message,
          count: oldTableData?.length || 0
        },
        policies: policies,
        policiesError: policiesError?.message
      });
      
      if (newTableError) {
        setError(`Neue Tabelle Fehler: ${newTableError.message}`);
      } else if (newTableData && newTableData.length > 0) {
        toast({
          title: "Verbindung erfolgreich",
          description: `${newTableData.length} Bestellungen in neuer Tabelle gefunden`,
        });
      } else {
        setError("Neue Tabelle ist leer oder nicht erreichbar");
      }
      
    } catch (error: any) {
      console.error('Database test error:', error);
      setError(`Verbindungsfehler: ${error.message}`);
      toast({
        title: "Datenbankfehler",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Bestellverwaltung - Debug Modus
          </CardTitle>
          <div className="flex justify-end">
            <Button onClick={testDatabaseConnection} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verbindung testen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Teste Datenbankverbindung...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <strong>Fehler:</strong>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          )}
          
          {debugInfo && (
            <div className="space-y-6">
              {/* Tabellen-Info */}
              <div>
                <h3 className="font-semibold mb-2">Verfügbare Bestellungs-Tabellen:</h3>
                <div className="bg-gray-50 p-3 rounded">
                  {debugInfo.tables.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {debugInfo.tables.map((table: any, index: number) => (
                        <li key={index} className="text-sm">{table.table_name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Keine Bestellungs-Tabellen gefunden</p>
                  )}
                  {debugInfo.tablesError && (
                    <p className="text-red-600 text-sm mt-2">Fehler: {debugInfo.tablesError}</p>
                  )}
                </div>
              </div>
              
              {/* Neue Tabelle */}
              <div>
                <h3 className="font-semibold mb-2">Neue Tabelle (2025_11_06_21_00):</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Status:</strong> {debugInfo.newTable.error ? '❌ Fehler' : '✅ OK'}
                  </p>
                  <p className="text-sm">
                    <strong>Anzahl Datensätze:</strong> {debugInfo.newTable.count}
                  </p>
                  {debugInfo.newTable.error && (
                    <p className="text-red-600 text-sm">Fehler: {debugInfo.newTable.error}</p>
                  )}
                  {debugInfo.newTable.data.length > 0 && (
                    <div className="mt-2">
                      <strong className="text-sm">Beispiel-Daten:</strong>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(debugInfo.newTable.data[0], null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Alte Tabelle */}
              <div>
                <h3 className="font-semibold mb-2">Alte Tabelle (2025_10_31_12_00):</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Status:</strong> {debugInfo.oldTable.error ? '❌ Fehler' : '✅ OK'}
                  </p>
                  <p className="text-sm">
                    <strong>Anzahl Datensätze:</strong> {debugInfo.oldTable.count}
                  </p>
                  {debugInfo.oldTable.error && (
                    <p className="text-red-600 text-sm">Fehler: {debugInfo.oldTable.error}</p>
                  )}
                </div>
              </div>
              
              {/* Empfehlung */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Empfehlung:</h3>
                <div className="text-blue-700 text-sm space-y-1">
                  {debugInfo.newTable.error ? (
                    <p>❌ Neue Tabelle nicht verfügbar - verwende alte Tabelle</p>
                  ) : debugInfo.newTable.count > 0 ? (
                    <p>✅ Neue Tabelle funktional - kann verwendet werden</p>
                  ) : (
                    <p>⚠️ Neue Tabelle leer - Test-Daten einfügen</p>
                  )}
                  
                  {debugInfo.oldTable.count > 0 && (
                    <p>📊 Alte Tabelle hat {debugInfo.oldTable.count} Datensätze</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};