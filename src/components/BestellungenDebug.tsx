import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';

export const BestellungenDebug: React.FC = () => {
  const [bestellungen, setBestellungen] = useState<any[]>([]);
  const [positionen, setPositionen] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('=== BESTELLUNGEN DEBUG START ===');
      
      // 1. Lade Bestellungen
      console.log('Loading orders from simple_bestellungen_2025_10_31_12_00...');
      const { data: bestellungenData, error: bestellungenError } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .select('*')
        .order('erstellt_am', { ascending: false });
      
      console.log('Orders result:', { data: bestellungenData, error: bestellungenError });
      
      if (bestellungenError) {
        throw new Error(`Bestellungen Fehler: ${bestellungenError.message}`);
      }
      
      setBestellungen(bestellungenData || []);
      
      // 2. Lade Positionen
      console.log('Loading positions from simple_bestellpositionen_2025_10_31_12_00...');
      const { data: positionenData, error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_10_31_12_00')
        .select('*')
        .order('erstellt_am', { ascending: false });
      
      console.log('Positions result:', { data: positionenData, error: positionenError });
      
      if (positionenError) {
        throw new Error(`Positionen Fehler: ${positionenError.message}`);
      }
      
      setPositionen(positionenData || []);
      
      console.log('=== BESTELLUNGEN DEBUG END ===');
      console.log(`Gefunden: ${bestellungenData?.length || 0} Bestellungen, ${positionenData?.length || 0} Positionen`);
      
    } catch (err: any) {
      console.error('Debug Fehler:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Bestellungen Debug
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Neu laden
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h3 className="font-semibold text-red-800">Fehler:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bestellungen */}
            <div>
              <h3 className="font-semibold mb-3">
                Bestellungen ({bestellungen.length})
              </h3>
              {bestellungen.length === 0 ? (
                <p className="text-gray-500 italic">Keine Bestellungen gefunden</p>
              ) : (
                <div className="space-y-2">
                  {bestellungen.map((bestellung, index) => (
                    <div key={bestellung.id} className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm">
                        <strong>#{index + 1}</strong> - {bestellung.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {bestellung.email} | {bestellung.gesamtpreis}€ | {bestellung.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(bestellung.erstellt_am).toLocaleString('de-DE')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Positionen */}
            <div>
              <h3 className="font-semibold mb-3">
                Bestellpositionen ({positionen.length})
              </h3>
              {positionen.length === 0 ? (
                <p className="text-gray-500 italic">Keine Positionen gefunden</p>
              ) : (
                <div className="space-y-2">
                  {positionen.map((position, index) => (
                    <div key={position.id} className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm">
                        <strong>{position.produkt_name}</strong>
                      </div>
                      <div className="text-xs text-gray-600">
                        {position.menge}x {position.einzelpreis}€ = {position.gesamtpreis}€
                      </div>
                      <div className="text-xs text-gray-500">
                        Bestellung: {position.bestellung_id?.substring(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Zusammenfassung */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">Zusammenfassung:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Bestellungen in Datenbank: {bestellungen.length}</li>
              <li>• Bestellpositionen in Datenbank: {positionen.length}</li>
              <li>• Tabelle: simple_bestellungen_2025_10_31_12_00</li>
              <li>• Tabelle: simple_bestellpositionen_2025_10_31_12_00</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};