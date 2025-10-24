import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Trash2, Mail, Phone, MapPin } from 'lucide-react';

interface WildfleischItem {
  produkt: string;
  kategorie: string;
  preis: string;
  einheit: string;
  verfügbar: boolean;
}

interface BestellItem {
  produkt: string;
  preis: string;
  menge: number;
}

export const Wildfleischverkauf: React.FC = () => {
  const [warenkorb, setWarenkorb] = useState<BestellItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    nachricht: ''
  });
  const [loading, setLoading] = useState(false);

  const wildfleischSortiment: WildfleischItem[] = [
    // Rehwild
    { produkt: 'Rehkeule', kategorie: 'Rehwild', preis: '18.50', einheit: 'kg', verfügbar: true },
    { produkt: 'Rehrücken', kategorie: 'Rehwild', preis: '22.00', einheit: 'kg', verfügbar: true },
    { produkt: 'Rehschulter', kategorie: 'Rehwild', preis: '16.00', einheit: 'kg', verfügbar: true },
    { produkt: 'Rehgulasch', kategorie: 'Rehwild', preis: '15.50', einheit: 'kg', verfügbar: true },
    { produkt: 'Rehmedaillons', kategorie: 'Rehwild', preis: '28.00', einheit: 'kg', verfügbar: false },
    
    // Schwarzwild
    { produkt: 'Wildschweinkeule', kategorie: 'Schwarzwild', preis: '12.50', einheit: 'kg', verfügbar: true },
    { produkt: 'Wildschweinrücken', kategorie: 'Schwarzwild', preis: '16.00', einheit: 'kg', verfügbar: true },
    { produkt: 'Wildschweinschulter', kategorie: 'Schwarzwild', preis: '10.50', einheit: 'kg', verfügbar: true },
    { produkt: 'Wildschweingulasch', kategorie: 'Schwarzwild', preis: '9.50', einheit: 'kg', verfügbar: true },
    { produkt: 'Wildschweinhackfleisch', kategorie: 'Schwarzwild', preis: '8.50', einheit: 'kg', verfügbar: true },
    
    // Federwild
    { produkt: 'Fasan', kategorie: 'Federwild', preis: '12.00', einheit: 'Stück', verfügbar: true },
    { produkt: 'Wildente', kategorie: 'Federwild', preis: '8.50', einheit: 'Stück', verfügbar: false },
    { produkt: 'Wildgans', kategorie: 'Federwild', preis: '15.00', einheit: 'Stück', verfügbar: true }
  ];

  const kategorien = ['Rehwild', 'Schwarzwild', 'Federwild'];

  const addToWarenkorb = (item: WildfleischItem) => {
    const existingItem = warenkorb.find(w => w.produkt === item.produkt);
    if (existingItem) {
      setWarenkorb(warenkorb.map(w => 
        w.produkt === item.produkt 
          ? { ...w, menge: w.menge + 1 }
          : w
      ));
    } else {
      setWarenkorb([...warenkorb, { 
        produkt: item.produkt, 
        preis: item.preis, 
        menge: 1 
      }]);
    }
    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${item.produkt} wurde hinzugefügt`,
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
    return warenkorb.reduce((sum, item) => sum + (parseFloat(item.preis) * item.menge), 0).toFixed(2);
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

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('wildfleisch_bestellung_2025_10_24_07_02', {
        body: {
          ...formData,
          bestellung: warenkorb,
          gesamtpreis: getGesamtpreis()
        }
      });

      if (error) throw error;

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
      console.error('Error:', error);
      toast({
        title: "Fehler beim Senden",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
              src="/images/wildfleisch_2.jpeg" 
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
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Unser Wildfleisch-Sortiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kategorien.map(kategorie => (
                  <div key={kategorie} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-green-800">{kategorie}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produkt</TableHead>
                          <TableHead>Preis</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aktion</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wildfleischSortiment
                          .filter(item => item.kategorie === kategorie)
                          .map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.produkt}</TableCell>
                              <TableCell>{item.preis}€ / {item.einheit}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={item.verfügbar ? "default" : "secondary"}
                                  className={item.verfügbar ? "bg-green-100 text-green-800" : ""}
                                >
                                  {item.verfügbar ? "Verfügbar" : "Ausverkauft"}
                                </Badge>
                              </TableCell>
                              <TableCell>
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
                ))}
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
                  <span className="text-sm">+49 (0) 123 456 789</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p>Abholung nach Vereinbarung</p>
                    <p className="text-gray-600">Dorfstraße 45, 30900 Weetzen</p>
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