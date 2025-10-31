import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthDialog } from './AuthDialog';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Trash2, Mail, Phone, MapPin, RefreshCw, Lock, LogIn, Info } from 'lucide-react';

interface WildfleischItem {
  id: string;
  produkt_name: string;
  kategorie: string;
  preis: number;
  einheit: string;
  lagerbestand: number;
  verfügbar: boolean;
}

interface BestellItem {
  produkt: string;
  preis: number;
  menge: number;
}

export const WildfleischShop: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [warenkorb, setWarenkorb] = useState<BestellItem[]>([]);
  const [wildfleischSortiment, setWildfleischSortiment] = useState<WildfleischItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    nachricht: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Lade Sortiment aus Datenbank
  const fetchSortiment = async () => {
    try {
      const { data, error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .select('*')
        .order('reihenfolge', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden des Sortiments:', error);
        toast({
          title: "Fehler",
          description: "Sortiment konnte nicht geladen werden.",
          variant: "destructive",
        });
        return;
      }

      setWildfleischSortiment(data || []);
    } catch (error) {
      console.error('Unerwarteter Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSortiment();
  }, []);

  // Fülle Formular mit Benutzerdaten wenn angemeldet
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const addToWarenkorb = (item: WildfleischItem) => {
    const existingItem = warenkorb.find(w => w.produkt === item.produkt_name);
    
    if (existingItem) {
      if (existingItem.menge >= item.lagerbestand) {
        toast({
          title: "Nicht genügend Lagerbestand",
          description: `Nur noch ${item.lagerbestand} Stück verfügbar.`,
          variant: "destructive",
        });
        return;
      }
      setWarenkorb(warenkorb.map(w => 
        w.produkt === item.produkt_name 
          ? { ...w, menge: w.menge + 1 }
          : w
      ));
    } else {
      setWarenkorb([...warenkorb, {
        produkt: item.produkt_name,
        preis: item.preis,
        menge: 1
      }]);
    }

    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${item.produkt_name}`,
    });
  };

  const updateMenge = (produktName: string, newMenge: number) => {
    if (newMenge <= 0) {
      setWarenkorb(warenkorb.filter(item => item.produkt !== produktName));
      return;
    }

    const item = wildfleischSortiment.find(w => w.produkt_name === produktName);
    if (item && newMenge > item.lagerbestand) {
      toast({
        title: "Nicht genügend Lagerbestand",
        description: `Nur noch ${item.lagerbestand} Stück verfügbar.`,
        variant: "destructive",
      });
      return;
    }

    setWarenkorb(warenkorb.map(w => 
      w.produkt === produktName 
        ? { ...w, menge: newMenge }
        : w
    ));
  };

  const removeFromWarenkorb = (produktName: string) => {
    setWarenkorb(warenkorb.filter(item => item.produkt !== produktName));
  };

  const getTotal = () => {
    return warenkorb.reduce((total, item) => total + (item.preis * item.menge), 0);
  };

  const getWarenkorbCount = () => {
    return warenkorb.reduce((total, item) => total + item.menge, 0);
  };

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

    if (!formData.name || !formData.email) {
      toast({
        title: "Pflichtfelder fehlen",
        description: "Name und E-Mail sind erforderlich.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      console.log('Submitting order:', { formData, warenkorb });
      
      const gesamtpreis = getTotal();
      
      // Direkte Datenbank-Speicherung mit einfachen Tabellen
      const { data: bestellungData, error: bestellungError } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .insert({
          name: formData.name,
          email: formData.email,
          telefon: formData.phone,
          adresse: formData.address,
          nachricht: formData.nachricht,
          gesamtpreis: gesamtpreis,
          status: 'neu'
        })
        .select()
        .single();
      
      if (bestellungError) {
        console.error('Fehler beim Erstellen der Bestellung:', bestellungError);
        throw new Error(`Bestellung konnte nicht erstellt werden: ${bestellungError.message}`);
      }
      
      console.log('Bestellung erstellt:', bestellungData);
      
      // Bestellpositionen hinzufügen
      const bestellpositionen = warenkorb.map(item => ({
        bestellung_id: bestellungData.id,
        produkt_name: item.produkt,
        menge: item.menge,
        einzelpreis: item.preis,
        gesamtpreis: item.menge * item.preis
      }));
      
      const { error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_10_31_12_00')
        .insert(bestellpositionen);
      
      if (positionenError) {
        console.error('Fehler beim Erstellen der Bestellpositionen:', positionenError);
        // Bestellung löschen falls Positionen fehlschlagen
        await supabase
          .from('simple_bestellungen_2025_10_31_12_00')
          .delete()
          .eq('id', bestellungData.id);
        throw new Error(`Bestellpositionen konnten nicht erstellt werden: ${positionenError.message}`);
      }
      
      console.log('Bestellpositionen erstellt:', bestellpositionen.length);

      toast({
        title: "Bestellung gesendet",
        description: "Ihre Bestellung wurde erfolgreich übermittelt. Sie erhalten eine Bestätigung per E-Mail.",
      });

      // Formular und Warenkorb zurücksetzen
      setWarenkorb([]);
      setFormData({
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        phone: '',
        address: '',
        nachricht: ''
      });

    } catch (error: any) {
      console.error('Fehler beim Senden der Bestellung:', error);
      toast({
        title: "Fehler beim Senden",
        description: error.message || "Die Bestellung konnte nicht gesendet werden.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <section id="wildfleisch-shop" className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Lade Wildfleisch-Sortiment...</p>
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
            und werden fachgerecht verarbeitet.
          </p>
        </div>

        {/* Anmelde-Hinweis für nicht angemeldete Benutzer */}
        {!user && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Hinweis:</strong> Um Wildfleisch zu bestellen, müssen Sie sich anmelden. 
                  Sie können das Sortiment gerne durchstöbern, aber für Bestellungen ist eine Registrierung erforderlich.
                </div>
                <AuthDialog />
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sortiment */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Wildfleisch-Sortiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Produkt</TableHead>
                      <TableHead className="w-1/4">Kategorie</TableHead>
                      <TableHead className="w-1/4">Preis</TableHead>
                      <TableHead className="w-1/4">Aktion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wildfleischSortiment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div>
                            {item.produkt_name}
                            <div className="text-sm text-gray-500">
                              Lagerbestand: {item.lagerbestand}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.kategorie}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {item.preis.toFixed(2)}€ / {item.einheit}
                        </TableCell>
                        <TableCell>
                          {user ? (
                            item.lagerbestand > 0 ? (
                              <Button
                                size="sm"
                                onClick={() => addToWarenkorb(item)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Hinzufügen
                              </Button>
                            ) : (
                              <Badge variant="destructive">Ausverkauft</Badge>
                            )
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="opacity-50"
                            >
                              <Lock className="h-4 w-4 mr-1" />
                              Anmeldung erforderlich
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Warenkorb und Bestellung */}
          <div className="space-y-6">
            {/* Warenkorb */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Warenkorb
                  </span>
                  {warenkorb.length > 0 && (
                    <Badge variant="secondary">{getWarenkorbCount()} Artikel</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {warenkorb.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {user ? "Warenkorb ist leer" : "Melden Sie sich an, um Artikel hinzuzufügen"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {warenkorb.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium">{item.produkt}</div>
                          <div className="text-sm text-gray-600">
                            {item.preis.toFixed(2)}€ / Stück
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMenge(item.produkt, item.menge - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.menge}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMenge(item.produkt, item.menge + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromWarenkorb(item.produkt)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Gesamt:</span>
                        <span>{getTotal().toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bestellformular */}
            {user && warenkorb.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Bestellung aufgeben
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ihr vollständiger Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="ihre@email.de"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ihre Telefonnummer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Ihre Adresse für die Lieferung"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nachricht">Nachricht</Label>
                    <Textarea
                      id="nachricht"
                      value={formData.nachricht}
                      onChange={(e) => setFormData({...formData, nachricht: e.target.value})}
                      placeholder="Besondere Wünsche oder Anmerkungen"
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={submitBestellung} 
                    disabled={submitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Bestellung senden
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};