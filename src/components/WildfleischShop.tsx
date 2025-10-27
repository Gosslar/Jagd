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
import { useAuth } from '@/contexts/AuthProvider';
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
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ShopKategorie {
  id: string;
  name: string;
  beschreibung: string;
  farbe: string;
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
  const { user } = useAuth();
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

  useEffect(() => {
    if (user) {
      setCheckoutForm(prev => ({
        ...prev,
        kunde_name: user.user_metadata?.full_name || '',
        kunde_email: user.email || ''
      }));
    }
  }, [user]);

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      // Kategorien laden
      const { data: kategorienData, error: kategorienError } = await supabase
        .from('shop_kategorien_2025_10_27_14_00')
        .select('*')
        .eq('aktiv', true)
        .eq('sichtbar_fuer_kunden', true)
        .order('reihenfolge');
      
      if (kategorienError) throw kategorienError;
      setKategorien(kategorienData || []);
      
      // Produkte laden
      const { data: produkteData, error: produkteError } = await supabase
        .from('shop_produkte_2025_10_27_14_00')
        .select('*')
        .eq('aktiv', true)
        .eq('sichtbar_fuer_kunden', true)
        .order('kategorie_id, reihenfolge');
      
      if (produkteError) throw produkteError;
      setProdukte(produkteData || []);
      
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Warenkorb-Funktionen
  const addToWarenkorb = (produkt: ShopProdukt, menge: number = 1) => {
    if (menge > produkt.lagerbestand) {
      toast({
        title: "Nicht genügend Lagerbestand",
        description: `Nur noch ${produkt.lagerbestand} Stück verfügbar.`,
        variant: "destructive",
      });
      return;
    }

    setWarenkorb(prev => {
      const existingItem = prev.find(item => item.produkt.id === produkt.id);
      if (existingItem) {
        const newMenge = existingItem.menge + menge;
        if (newMenge > produkt.lagerbestand) {
          toast({
            title: "Nicht genügend Lagerbestand",
            description: `Nur noch ${produkt.lagerbestand} Stück verfügbar.`,
            variant: "destructive",
          });
          return prev;
        }
        return prev.map(item =>
          item.produkt.id === produkt.id
            ? { ...item, menge: newMenge }
            : item
        );
      } else {
        return [...prev, { produkt, menge }];
      }
    });

    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${menge}x ${produkt.name}`,
    });
  };

  const updateWarenkorbMenge = (produktId: string, newMenge: number) => {
    if (newMenge <= 0) {
      removeFromWarenkorb(produktId);
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

    setWarenkorb(prev =>
      prev.map(item =>
        item.produkt.id === produktId
          ? { ...item, menge: newMenge }
          : item
      )
    );
  };

  const removeFromWarenkorb = (produktId: string) => {
    setWarenkorb(prev => prev.filter(item => item.produkt.id !== produktId));
  };

  const getWarenkorbTotal = () => {
    return warenkorb.reduce((total, item) => total + (item.produkt.preis * item.menge), 0);
  };

  const getWarenkorbItemCount = () => {
    return warenkorb.reduce((total, item) => total + item.menge, 0);
  };

  // Checkout-Funktionen
  const submitBestellung = async () => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um eine Bestellung aufzugeben.",
        variant: "destructive",
      });
      return;
    }

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
          kunde_id: user.id,
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
      setCheckoutDialog(false);
      
      // Daten neu laden für aktualisierte Lagerbestände
      loadShopData();

    } catch (error: any) {
      toast({
        title: "Fehler bei der Bestellung",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter-Funktionen
  const getFilteredProdukte = () => {
    if (selectedKategorie === 'alle') {
      return produkte;
    }
    return produkte.filter(p => p.kategorie_id === selectedKategorie);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Lade Shop...</div>
      </div>
    );
  }

  return (
    <section id="wildfleisch-shop" className="py-16 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Wildfleisch-Shop
          </h2>
          <p className="text-xl text-green-600 max-w-3xl mx-auto">
            Frisches Wildfleisch aus nachhaltiger Jagd - direkt vom Jäger zur Abholung
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hauptbereich */}
          <div className="flex-1">
            {/* Kategorie-Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
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
                    style={{
                      backgroundColor: selectedKategorie === kategorie.id ? kategorie.farbe : undefined,
                      borderColor: kategorie.farbe
                    }}
                  >
                    {kategorie.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Produkte Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredProdukte().map((produkt) => {
                const kategorie = kategorien.find(k => k.id === produkt.kategorie_id);
                const warenkorbItem = warenkorb.find(item => item.produkt.id === produkt.id);
                
                return (
                  <Card key={produkt.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{produkt.name}</CardTitle>
                          {kategorie && (
                            <Badge 
                              variant="outline" 
                              className="mt-1"
                              style={{ borderColor: kategorie.farbe, color: kategorie.farbe }}
                            >
                              {kategorie.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {produkt.preis.toFixed(2)}€
                          </div>
                          <div className="text-sm text-gray-500">
                            {produkt.einheit}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm">
                        {produkt.kurzbeschreibung}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {produkt.herkunft && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {produkt.herkunft}
                          </div>
                        )}
                        {produkt.haltbarkeit_tage && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            Haltbar: {produkt.haltbarkeit_tage} Tage
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {produkt.verfuegbar ? (
                            <Badge variant="default" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Verfügbar ({produkt.lagerbestand})
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Ausverkauft
                            </Badge>
                          )}
                        </div>
                      </div>

                      {produkt.verfuegbar && (
                        <div className="space-y-3">
                          {warenkorbItem ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateWarenkorbMenge(produkt.id, warenkorbItem.menge - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 py-1 bg-gray-100 rounded text-center min-w-[3rem]">
                                {warenkorbItem.menge}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateWarenkorbMenge(produkt.id, warenkorbItem.menge + 1)}
                                disabled={warenkorbItem.menge >= produkt.lagerbestand}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromWarenkorb(produkt.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToWarenkorb(produkt)}
                              className="w-full"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              In den Warenkorb
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Warenkorb Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Warenkorb ({getWarenkorbItemCount()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {warenkorb.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Ihr Warenkorb ist leer
                  </p>
                ) : (
                  <div className="space-y-3">
                    {warenkorb.map((item) => (
                      <div key={item.produkt.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.produkt.name}</h4>
                          <p className="text-xs text-gray-600">
                            {item.menge}x {item.produkt.preis.toFixed(2)}€
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {(item.produkt.preis * item.menge).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Gesamt:</span>
                        <span>{getWarenkorbTotal().toFixed(2)}€</span>
                      </div>
                    </div>

                    <Dialog open={checkoutDialog} onOpenChange={setCheckoutDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={!user}>
                          {user ? 'Zur Bestellung' : 'Anmeldung erforderlich'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Bestellung abschließen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="kunde-name">Name *</Label>
                            <Input
                              id="kunde-name"
                              value={checkoutForm.kunde_name}
                              onChange={(e) => setCheckoutForm({...checkoutForm, kunde_name: e.target.value})}
                              placeholder="Ihr vollständiger Name"
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
                            />
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
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="abholung-datum">Abholdatum *</Label>
                              <Input
                                id="abholung-datum"
                                type="date"
                                value={checkoutForm.abholung_datum}
                                onChange={(e) => setCheckoutForm({...checkoutForm, abholung_datum: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            <div>
                              <Label htmlFor="abholung-uhrzeit">Uhrzeit</Label>
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};