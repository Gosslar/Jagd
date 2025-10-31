import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Package, AlertTriangle } from 'lucide-react';

export const LagerbestandDebug: React.FC = () => {
  const [produkte, setProdukte] = useState<any[]>([]);
  const [bestellpositionen, setBestellpositionen] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('=== LAGERBESTAND DEBUG START ===');
      
      // 1. Lade Produkte
      console.log('Loading products from shop_produkte_2025_10_27_14_00...');
      const { data: produkteData, error: produkteError } = await supabase
        .from('shop_produkte_2025_10_27_14_00')
        .select('*')
        .order('name');
      
      console.log('Products result:', { data: produkteData, error: produkteError });
      
      if (produkteError) {
        throw new Error(`Produkte Fehler: ${produkteError.message}`);
      }
      
      setProdukte(produkteData || []);
      
      // 2. Lade Bestellpositionen
      console.log('Loading order positions from simple_bestellpositionen_2025_10_31_12_00...');
      const { data: positionenData, error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_10_31_12_00')
        .select(`
          *,
          simple_bestellungen_2025_10_31_12_00!inner(
            name,
            status,
            erstellt_am
          )
        `)
        .order('erstellt_am', { ascending: false });
      
      console.log('Positions result:', { data: positionenData, error: positionenError });
      
      if (positionenError) {
        throw new Error(`Positionen Fehler: ${positionenError.message}`);
      }
      
      setBestellpositionen(positionenData || []);
      
      console.log('=== LAGERBESTAND DEBUG END ===');
      console.log(`Gefunden: ${produkteData?.length || 0} Produkte, ${positionenData?.length || 0} Bestellpositionen`);
      
    } catch (err: any) {
      console.error('Debug Fehler:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testStockReduction = async (orderId: string) => {
    try {
      console.log('Testing stock reduction for order:', orderId);
      
      const { data, error } = await supabase.rpc('reduce_stock_for_order', {
        order_id_param: orderId
      });
      
      console.log('Stock reduction result:', { data, error });
      
      if (error) {
        throw error;
      }
      
      alert(`Lagerbestand-Test Ergebnis:\n${data}`);
      loadData(); // Reload to see changes
      
    } catch (err: any) {
      console.error('Stock reduction test failed:', err);
      alert(`Fehler beim Lagerbestand-Test: ${err.message}`);
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
            Lagerbestand Debug
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
            {/* Produkte */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produkte ({produkte.length})
              </h3>
              {produkte.length === 0 ? (
                <p className="text-gray-500 italic">Keine Produkte gefunden</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {produkte.map((produkt, index) => (
                    <div key={produkt.id} className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm font-medium">
                        {produkt.name || produkt.titel || 'Unbenannt'}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-4">
                        <span>Lagerbestand: <strong>{produkt.lagerbestand}</strong></span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          produkt.verfuegbar ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {produkt.verfuegbar ? 'Verfügbar' : 'Nicht verfügbar'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Preis: {produkt.preis}€/{produkt.einheit}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bestellpositionen */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Bestellpositionen ({bestellpositionen.length})
              </h3>
              {bestellpositionen.length === 0 ? (
                <p className="text-gray-500 italic">Keine Bestellpositionen gefunden</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {bestellpositionen.map((position, index) => {
                    const bestellung = position.simple_bestellungen_2025_10_31_12_00;
                    const produktMatch = produkte.find(p => p.name === position.produkt_name);
                    
                    return (
                      <div key={position.id} className="bg-gray-50 p-3 rounded border">
                        <div className="text-sm font-medium">
                          {position.produkt_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          Menge: {position.menge}x | Preis: {position.einzelpreis}€
                        </div>
                        <div className="text-xs text-gray-500">
                          Kunde: {bestellung?.name} | Status: {bestellung?.status}
                        </div>
                        {produktMatch ? (
                          <div className="text-xs text-green-600">
                            ✓ Produkt gefunden (Lager: {produktMatch.lagerbestand})
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">
                            ✗ Produkt nicht gefunden!
                          </div>
                        )}
                        {bestellung?.status === 'bestaetigt' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => testStockReduction(position.bestellung_id)}
                          >
                            Test Lagerbestand-Reduzierung
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Zusammenfassung */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">Lagerbestand-Analyse:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Produkte in Datenbank: {produkte.length}</li>
              <li>• Verfügbare Produkte: {produkte.filter(p => p.verfuegbar).length}</li>
              <li>• Produkte mit Lagerbestand &gt; 0: {produkte.filter(p => p.lagerbestand > 0).length}</li>
              <li>• Bestellpositionen gesamt: {bestellpositionen.length}</li>
              <li>• Bestätigte Bestellpositionen: {bestellpositionen.filter(p => p.simple_bestellungen_2025_10_31_12_00?.status === 'bestaetigt').length}</li>
              <li>• Produkt-Matches: {bestellpositionen.filter(p => produkte.some(prod => prod.name === p.produkt_name)).length}/{bestellpositionen.length}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};