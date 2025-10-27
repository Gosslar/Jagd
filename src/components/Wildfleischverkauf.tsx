import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Trash2, Mail, Phone, MapPin, RefreshCw, Lock, LogIn } from 'lucide-react';

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

export const Wildfleischverkauf: React.FC = () => {
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

      if (error) throw error;
      setWildfleischSortiment(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden des Sortiments:', error);
      toast({
        title: "Fehler",
        description: "Sortiment konnte nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSortiment();
  }, []);

  const kategorien = [...new Set(wildfleischSortiment.map(item => item.kategorie))];

  const addToWarenkorb = (item: WildfleischItem) => {
    const existingItem = warenkorb.find(w => w.produkt === item.produkt_name);
    if (existingItem) {
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
      description: `${item.produkt_name} wurde hinzugefügt`,
    });
  };

  const updateMenge = (produkt: string, newMenge: number) => {
    if (newMenge <= 0) {
      setWarenkorb(warenkorb.filter(w => w.produkt !== produkt));
    } else {
      setWarenkorb(warenkorb.map(w => 
        w.produkt === produkt ? { ...w, menge: newMenge } : w
      ));
    }
  };

  const removeFromWarenkorb = (produkt: string) => {
    setWarenkorb(warenkorb.filter(w => w.produkt !== produkt));
  };

  const getGesamtpreis = () => {
    return warenkorb.reduce((sum, item) => sum + (item.preis * item.menge), 0).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (warenkorb.length === 0) {
      toast({
        title: "Warenkorb leer",
        description: "Bitte fügen Sie Artikel zum Warenkorb hinzu",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('email_debug_test_2025_10_25_19_00', {
        body: {
          ...formData,
          bestellung: warenkorb,
          gesamtpreis: getGesamtpreis()
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Fehler beim Aufrufen der E-Mail-Funktion');
      }

      if (data?.error) {
        console.error('Edge function returned error:', data);
        throw new Error(data.details || data.error || 'E-Mail-Service Fehler');
      }

      toast({
        title: "Bestellung gesendet",
        description: "Ihre Wildfleisch-Bestellung wurde erfolgreich gesendet. Wir melden uns bald bei Ihnen.",
      });

      // Reset form and cart
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        nachricht: ''
      });
      setWarenkorb([]);

    } catch (error: any) {
      console.error('Error details:', error);
      
      let errorMessage = "Ein unbekannter Fehler ist aufgetreten";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Fehler beim Senden",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="wildfleischverkauf" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wildfleischverkauf</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Frisches Wildfleisch direkt aus unserem Revier. Alle Tiere werden fachgerecht erlegt, 
            verarbeitet und unterliegen strengsten Qualitätskontrollen.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img 
              src="/images/weetzen.jpg" 
              alt="Frisches Wildfleisch"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Frisches Wildfleisch aus der Region</h3>
                <p className="text-lg">Höchste Qualität - Direkt vom Jäger</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produktliste */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Unser Wildfleisch-Sortiment
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchSortiment}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Aktualisieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
                    <p>Lade Sortiment...</p>
                  </div>
                ) : (
                  kategorien.map(kategorie => (
                  <div key={kategorie} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-green-800">{kategorie}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/4">Produkt</TableHead>
                          <TableHead className="w-1/4">Preis</TableHead>
                          <TableHead className="w-1/4">Status</TableHead>
                          <TableHead className="w-1/4">Aktion</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wildfleischSortiment
                          .filter(item => item.kategorie === kategorie)
                          .map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium w-1/4">
                                {item.produkt_name}
                                {item.lagerbestand <= 3 && item.lagerbestand > 0 && (
                                  <span className="text-xs text-orange-600 ml-2">(Nur noch {item.lagerbestand})</span>
                                )}
                              </TableCell>
                              <TableCell className="w-1/4">{item.preis.toFixed(2)}€ / {item.einheit}</TableCell>
                              <TableCell className="w-1/4">
                                <Badge 
                                  variant={item.verfügbar ? "default" : "secondary"}
                                  className={item.verfügbar ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                  {item.verfügbar ? "Verfügbar" : "Ausverkauft"}
                                </Badge>
                              </TableCell>
                              <TableCell className="w-1/4">
                                <Button
                                  size="sm"
                                  onClick={() => addToWarenkorb(item)}
                                  disabled={!item.verfügbar}
                                  className="flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  Hinzufügen
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Warenkorb und Bestellformular */}
          <div className="space-y-6">
            {/* Warenkorb */}
            <Card>
              <CardHeader>
                <CardTitle>Warenkorb</CardTitle>
              </CardHeader>
              <CardContent>
                {warenkorb.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Warenkorb ist leer</p>
                ) : (
                  <div className="space-y-3">
                    {warenkorb.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.produkt}</p>
                          <p className="text-xs text-gray-600">{item.preis}€ / Stück</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMenge(item.produkt, item.menge - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.menge}</span>
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
                      <div className="flex justify-between items-center font-bold">
                        <span>Gesamtpreis:</span>
                        <span>{getGesamtpreis()}€</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bestellformular */}
            <Card>
              <CardHeader>
                <CardTitle>Bestellung aufgeben</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Straße, PLZ Ort"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nachricht">Nachricht</Label>
                    <Textarea
                      id="nachricht"
                      name="nachricht"
                      rows={3}
                      value={formData.nachricht}
                      onChange={handleInputChange}
                      placeholder="Besondere Wünsche oder Anmerkungen..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || warenkorb.length === 0}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {loading ? 'Wird gesendet...' : 'Bestellung senden'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Kontaktinfo */}
            <Card>
              <CardHeader>
                <CardTitle>Kontakt & Abholung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="text-sm">info@jagd-weetzen.de</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm">+49 172 5265166</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p>Abholung nach Vereinbarung</p>
                    <p className="text-gray-600">Am Denkmal 16, 30952 Linderte</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Hinweis:</strong> Alle Preise verstehen sich inklusive 
                    Mehrwertsteuer. Abholung erfolgt nach telefonischer Vereinbarung.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};