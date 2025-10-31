import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface ShopKategorie {
  id: string;
  name: string;
  beschreibung: string;
  reihenfolge: number;
}

interface ShopProdukt {
  id: string;
  kategorie_id: string;
  name: string;
  beschreibung: string;
  kurzbeschreibung: string;
  preis: number;
  einheit: string;
  gewicht: number;
  lagerbestand: number;
  verfuegbar: boolean;
  hauptbild_url: string;
  herkunft: string;
  haltbarkeit_tage: number;
  lagerung_hinweise: string;
  zubereitungs_hinweise: string;
}

interface WarenkorbItem {
  produkt: ShopProdukt;
  menge: number;
}

export const WildfleischShop = () => {
  const { toast } = useToast();
  
  // Verfügbarkeitsstatus berechnen
  const getVerfuegbarkeitsStatus = (lagerbestand: number) => {
    if (lagerbestand === 0) {
      return {
        status: 'Ausverkauft',
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'text-red-600'
      };
    } else if (lagerbestand <= 5) {
      return {
        status: `Knapp (${lagerbestand})`,
        variant: 'secondary' as const,
        icon: AlertTriangle,
        className: 'text-orange-600'
      };
    } else {
      return {
        status: 'Verfügbar',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'text-green-600'
      };
    }
  };
  
  const [kategorien, setKategorien] = useState<ShopKategorie[]>([]);
  const [produkte, setProdukte] = useState<ShopProdukt[]>([]);
  const [warenkorb, setWarenkorb] = useState<WarenkorbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategorie, setSelectedKategorie] = useState<string>('alle');
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  
  // Checkout Form
  const [checkoutForm, setCheckoutForm] = useState({
    kunde_name: '',
    kunde_email: '',
    kunde_telefon: '',
    abholung_datum: '',
    abholung_uhrzeit: '10:00',
    abholung_notiz: ''
  });

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      // Kategorien laden
      const { data: kategorienData, error: kategorienError } = await supabase
        .from('shop_kategorien_2025_10_27_14_00')
        .select('*')
        .order('reihenfolge');
      
      if (kategorienError) throw kategorienError;
      setKategorien(kategorienData || []);
      
      // Produkte laden
      const { data: produkteData, error: produkteError } = await supabase
        .from('shop_produkte_2025_10_27_14_00')
        .select('*')
        .eq('verfuegbar', true)
        .order('reihenfolge');
      
      if (produkteError) throw produkteError;
      setProdukte(produkteData || []);
      
    } catch (error: any) {
      console.error('Fehler beim Laden der Shop-Daten:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Shop-Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Einfache Warenkorb-Funktionen
  const addToWarenkorb = (produkt: ShopProdukt) => {
    if (!produkt || produkt.lagerbestand <= 0) {
      toast({
        title: "Nicht verfügbar",
        description: "Dieses Produkt ist nicht verfügbar.",
        variant: "destructive",
      });
      return;
    }

    const existingItem = warenkorb.find(item => item.produkt.id === produkt.id);
    
    if (existingItem) {
      if (existingItem.menge >= produkt.lagerbestand) {
        toast({
          title: "Nicht genügend Lagerbestand",
          description: `Nur noch ${produkt.lagerbestand} Stück verfügbar.`,
          variant: "destructive",
        });
        return;
      }
      
      setWarenkorb(warenkorb.map(item =>
        item.produkt.id === produkt.id
          ? { ...item, menge: item.menge + 1 }
          : item
      ));
    } else {
      setWarenkorb([...warenkorb, { produkt, menge: 1 }]);
    }

    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${produkt.name}`,
    });
  };

  const updateMenge = (produktId: string, newMenge: number) => {
    if (newMenge <= 0) {
      setWarenkorb(warenkorb.filter(item => item.produkt.id !== produktId));
      return;
    }

    const produkt = produkte.find(p => p.id === produktId);
    if (produkt && newMenge > produkt.lagerbestand) {
      toast({
        title: "Nicht genügend Lagerbestand",
        description: `Nur noch ${produkt.lagerbestand} Stück verfügbar.`,
        variant: "destructive",
      });
      return;
    }

    setWarenkorb(warenkorb.map(item =>
      item.produkt.id === produktId
        ? { ...item, menge: newMenge }
        : item
    ));
  };

  const removeFromWarenkorb = (produktId: string) => {
    setWarenkorb(warenkorb.filter(item => item.produkt.id !== produktId));
  };

  const getWarenkorbTotal = () => {
    return warenkorb.reduce((total, item) => total + (item.produkt.preis * item.menge), 0);
  };

  const getWarenkorbCount = () => {
    return warenkorb.reduce((total, item) => total + item.menge, 0);
  };

  // Checkout-Funktionen
  const submitBestellung = async () => {
    if (warenkorb.length === 0) {
      toast({
        title: "Warenkorb leer",
        description: "Fügen Sie Produkte zum Warenkorb hinzu.",
        variant: "destructive",
      });
      return;
    }

    if (!checkoutForm.kunde_name || !checkoutForm.kunde_email || !checkoutForm.abholung_datum) {
      toast({
        title: "Pflichtfelder fehlen",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Bestellung erstellen
      const { data: bestellung, error: bestellungError } = await supabase
        .from('shop_bestellungen_2025_10_27_14_00')
        .insert({
          kunde_id: null, // Gast-Bestellung
          kunde_name: checkoutForm.kunde_name,
          kunde_email: checkoutForm.kunde_email,
          kunde_telefon: checkoutForm.kunde_telefon,
          abholung_datum: checkoutForm.abholung_datum,
          abholung_uhrzeit: checkoutForm.abholung_uhrzeit,
          abholung_notiz: checkoutForm.abholung_notiz,
          gesamtpreis: getWarenkorbTotal(),
          zahlungsart: 'bar',
          status: 'neu'
        })
        .select()
        .single();

      if (bestellungError) throw bestellungError;

      // Bestellpositionen erstellen
      const bestellpositionen = warenkorb.map(item => ({
        bestellung_id: bestellung.id,
        produkt_id: item.produkt.id,
        produkt_name: item.produkt.name,
        menge: item.menge,
        einzelpreis: item.produkt.preis,
        gesamtpreis: item.produkt.preis * item.menge
      }));

      const { error: positionenError } = await supabase
        .from('shop_bestellpositionen_2025_10_27_14_00')
        .insert(bestellpositionen);

      if (positionenError) throw positionenError;

      toast({
        title: "Bestellung erfolgreich",
        description: `Ihre Bestellung ${bestellung.bestellnummer} wurde aufgegeben.`,
      });

      // Warenkorb leeren und Dialog schließen
      setWarenkorb([]);
      setCheckoutForm({
        kunde_name: '',
        kunde_email: '',
        kunde_telefon: '',
        abholung_datum: '',
        abholung_uhrzeit: '10:00',
        abholung_notiz: ''
      });
      setCheckoutDialog(false);

    } catch (error: any) {
      console.error('Fehler beim Aufgeben der Bestellung:', error);
      toast({
        title: "Fehler bei der Bestellung",
        description: error.message || "Die Bestellung konnte nicht aufgegeben werden.",
        variant: "destructive",
      });
    }
  };

  // Gefilterte Produkte
  const filteredProdukte = selectedKategorie === 'alle' 
    ? produkte 
    : produkte.filter(p => p.kategorie_id === selectedKategorie);

  if (loading) {
    return (
      <section id="wildfleisch-shop" className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Shop wird geladen...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="wildfleisch-shop" className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wildfleisch Shop</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Frisches Wildfleisch aus nachhaltiger Jagd. Alle Produkte stammen aus unserem Revier 
            und werden fachgerecht verarbeitet. Barzahlung bei Abholung.
          </p>
        </div>

        {/* Warenkorb-Anzeige */}
        {warenkorb.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="font-medium">
                  {getWarenkorbCount()} Artikel im Warenkorb
                </span>
                <Badge variant="secondary">
                  {getWarenkorbTotal().toFixed(2)}€
                </Badge>
              </div>
              <Dialog open={checkoutDialog} onOpenChange={setCheckoutDialog}>
                <DialogTrigger asChild>
                  <Button>Zur Kasse</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Bestellung aufgeben</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kunde-name">Name *</Label>
                        <Input
                          id="kunde-name"
                          value={checkoutForm.kunde_name}
                          onChange={(e) => setCheckoutForm({...checkoutForm, kunde_name: e.target.value})}
                          placeholder="Ihr vollständiger Name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="kunde-email">E-Mail *</Label>
                        <Input
                          id="kunde-email"
                          type="email"
                          value={checkoutForm.kunde_email}
                          onChange={(e) => setCheckoutForm({...checkoutForm, kunde_email: e.target.value})}
                          placeholder="ihre@email.de"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="kunde-telefon">Telefon</Label>
                      <Input
                        id="kunde-telefon"
                        value={checkoutForm.kunde_telefon}
                        onChange={(e) => setCheckoutForm({...checkoutForm, kunde_telefon: e.target.value})}
                        placeholder="Ihre Telefonnummer"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="abholung-datum">Abholung Datum *</Label>
                        <Input
                          id="abholung-datum"
                          type="date"
                          value={checkoutForm.abholung_datum}
                          onChange={(e) => setCheckoutForm({...checkoutForm, abholung_datum: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="abholung-uhrzeit">Abholung Uhrzeit</Label>
                        <Input
                          id="abholung-uhrzeit"
                          type="time"
                          value={checkoutForm.abholung_uhrzeit}
                          onChange={(e) => setCheckoutForm({...checkoutForm, abholung_uhrzeit: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="abholung-notiz">Notiz zur Abholung</Label>
                      <Textarea
                        id="abholung-notiz"
                        value={checkoutForm.abholung_notiz}
                        onChange={(e) => setCheckoutForm({...checkoutForm, abholung_notiz: e.target.value})}
                        placeholder="Besondere Wünsche oder Hinweise"
                      />
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-medium mb-2">Bestellübersicht:</h4>
                      {warenkorb.map((item) => (
                        <div key={item.produkt.id} className="flex justify-between text-sm">
                          <span>{item.menge}x {item.produkt.name}</span>
                          <span>{(item.produkt.preis * item.menge).toFixed(2)}€</span>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 font-bold">
                        <div className="flex justify-between">
                          <span>Gesamt:</span>
                          <span>{getWarenkorbTotal().toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded text-sm">
                      <p><strong>Zahlungsart:</strong> Barzahlung bei Abholung</p>
                      <p><strong>Abholung:</strong> Nach Terminvereinbarung</p>
                    </div>

                    <Button onClick={submitBestellung} className="w-full">
                      Bestellung verbindlich aufgeben
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Kategorie-Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedKategorie === 'alle' ? 'default' : 'outline'}
              onClick={() => setSelectedKategorie('alle')}
            >
              Alle Produkte
            </Button>
            {kategorien.map((kategorie) => (
              <Button
                key={kategorie.id}
                variant={selectedKategorie === kategorie.id ? 'default' : 'outline'}
                onClick={() => setSelectedKategorie(kategorie.id)}
              >
                {kategorie.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Produkte */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProdukte.map((produkt) => {
            const verfuegbarkeit = getVerfuegbarkeitsStatus(produkt.lagerbestand);
            const warenkorbItem = warenkorb.find(item => item.produkt.id === produkt.id);
            
            return (
              <Card key={produkt.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={produkt.hauptbild_url || './images/wildfleisch-placeholder.jpg'}
                    alt={produkt.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={verfuegbarkeit.variant} className="flex items-center gap-1">
                      <verfuegbarkeit.icon className="h-3 w-3" />
                      {verfuegbarkeit.status}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{produkt.name}</CardTitle>
                  <p className="text-sm text-gray-600">{produkt.kurzbeschreibung}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        {produkt.preis.toFixed(2)}€
                      </span>
                      <span className="text-sm text-gray-500">
                        pro {produkt.einheit}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Gewicht:</strong> {produkt.gewicht}g</p>
                      <p><strong>Herkunft:</strong> {produkt.herkunft}</p>
                    </div>
                    
                    {warenkorbItem ? (
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMenge(produkt.id, warenkorbItem.menge - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-3 font-medium">{warenkorbItem.menge}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMenge(produkt.id, warenkorbItem.menge + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromWarenkorb(produkt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      verfuegbarkeit.status !== 'Ausverkauft' && (
                        <Button
                          className="w-full"
                          onClick={() => addToWarenkorb(produkt)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          In den Warenkorb
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProdukte.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Keine Produkte in dieser Kategorie verfügbar.</p>
          </div>
        )}
      </div>
    </section>
  );
};