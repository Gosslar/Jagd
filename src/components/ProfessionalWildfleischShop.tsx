import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  Package,
  Euro,
  Clock,
  CheckCircle
} from 'lucide-react';

interface WildfleischItem {
  id: string;
  name: string;
  kategorie_id?: string;
  preis: number;
  einheit: string;
  lagerbestand: number;
  verfuegbar: boolean;
}

interface ShopKategorie {
  id: string;
  name: string;
  beschreibung?: string;
  icon?: string;
  farbe?: string;
  reihenfolge?: number;
}

interface WarenkorbItem {
  produkt: string;
  menge: number;
  preis: number;
  einheit: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  nachricht: string;
}

// Standard-Kategorien als Fallback
const DEFAULT_CATEGORIES = {
  'Rehwild': { icon: '🦌', farbe: '#8B4513', beschreibung: 'Zartes Rehfleisch aus heimischen Wäldern' },
  'Rotwild': { icon: '🦌', farbe: '#A0522D', beschreibung: 'Kräftiges Hirschfleisch von höchster Qualität' },
  'Schwarzwild': { icon: '🐗', farbe: '#654321', beschreibung: 'Würziges Wildschweinefleisch' },
  'Federwild': { icon: '🦆', farbe: '#228B22', beschreibung: 'Delikates Geflügel aus freier Wildbahn' },
  'Wurstspezialitäten': { icon: '🌭', farbe: '#B22222', beschreibung: 'Hausgemachte Wildwurst nach traditionellen Rezepten' },
  'Spezialitäten': { icon: '⭐', farbe: '#DAA520', beschreibung: 'Besondere Wildspezialitäten und Delikatessen' }
};

export const ProfessionalWildfleischShop: React.FC = () => {
  const { user } = useAuth();
  const [wildfleischSortiment, setWildfleischSortiment] = useState<WildfleischItem[]>([]);
  const [kategorien, setKategorien] = useState<ShopKategorie[]>([]);
  const [warenkorb, setWarenkorb] = useState<WarenkorbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeKategorie, setActiveKategorie] = useState<string>('Alle');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    nachricht: ''
  });

  // Kategorisiere Produkte basierend auf Namen
  const kategorisiereProdukt = (produktName: string): string => {
    const name = produktName.toLowerCase();
    if (name.includes('reh')) return 'Rehwild';
    if (name.includes('hirsch') || name.includes('rot')) return 'Rotwild';
    if (name.includes('schwein') || name.includes('sau')) return 'Schwarzwild';
    if (name.includes('ente') || name.includes('fasan') || name.includes('gans')) return 'Federwild';
    if (name.includes('wurst') || name.includes('bratwurst')) return 'Wurstspezialitäten';
    return 'Spezialitäten';
  };

  // Lade Kategorien aus der Datenbank
  const fetchKategorien = async () => {
    try {
      console.log('Loading categories from shop_kategorien_2025_10_27_14_00...');
      const { data: kategorienData, error } = await supabase
        .from('shop_kategorien_2025_10_27_14_00')
        .select('*')
        .order('reihenfolge', { ascending: true });

      if (error) {
        console.error('Error loading categories:', error);
        return [];
      }

      console.log('Categories loaded:', kategorienData);
      return kategorienData || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  // Lade Sortiment
  const fetchSortiment = async () => {
    try {
      setLoading(true);
      console.log('Loading products and categories...');
      
      // Lade Kategorien
      const kategorienData = await fetchKategorien();
      setKategorien(kategorienData);
      
      console.log('Loading products from shop_produkte_2025_10_27_14_00...');
      
      const { data, error } = await supabase
        .from('shop_produkte_2025_10_27_14_00')
        .select('*')
        .eq('verfuegbar', true)
        .gt('lagerbestand', 0)
        .order('name', { ascending: true });
      
      console.log('Products loaded:', data?.length || 0, 'available products');

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
      
    } catch (error: any) {
      console.error('Unerwarteter Fehler:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSortiment();
  }, []);

  // Fülle Formular mit Benutzerdaten
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Finde Kategorie für Produkt
  const findeKategorieForProdukt = (produkt: WildfleischItem): ShopKategorie | null => {
    if (produkt.kategorie_id) {
      return kategorien.find(k => k.id === produkt.kategorie_id) || null;
    }
    // Fallback: Kategorisierung basierend auf Namen
    const kategorieName = kategorisiereProdukt(produkt.name);
    return kategorien.find(k => k.name === kategorieName) || null;
  };

  // Gruppiere Produkte nach echten Kategorien
  const produkteByKategorie = wildfleischSortiment.reduce((acc, produkt) => {
    const kategorie = findeKategorieForProdukt(produkt);
    const kategorieName = kategorie?.name || 'Sonstige';
    
    if (!acc[kategorieName]) acc[kategorieName] = [];
    acc[kategorieName].push(produkt);
    return acc;
  }, {} as {[key: string]: WildfleischItem[]});

  // Verfügbare Kategorien - verwende echte Kategorien aus der Datenbank
  const verfuegbareKategorien = [
    'Alle', 
    ...kategorien
      .filter(k => produkteByKategorie[k.name] && produkteByKategorie[k.name].length > 0)
      .sort((a, b) => (a.reihenfolge || 999) - (b.reihenfolge || 999))
      .map(k => k.name)
  ];

  // Gefilterte Produkte
  const gefilterteProdukte = activeKategorie === 'Alle' 
    ? wildfleischSortiment 
    : produkteByKategorie[activeKategorie] || [];

  const addToWarenkorb = (item: WildfleischItem) => {
    const existingItem = warenkorb.find(w => w.produkt === item.name);
    
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
        w.produkt === item.name 
          ? { ...w, menge: w.menge + 1 }
          : w
      ));
    } else {
      setWarenkorb([...warenkorb, {
        produkt: item.name,
        menge: 1,
        preis: item.preis,
        einheit: item.einheit
      }]);
    }
    
    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${item.name} wurde hinzugefügt.`,
    });
  };

  const updateMenge = (produktName: string, newMenge: number) => {
    if (newMenge <= 0) {
      setWarenkorb(warenkorb.filter(item => item.produkt !== produktName));
      return;
    }

    const item = wildfleischSortiment.find(p => p.name === produktName);
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

  const getWarenkorbCount = () => {
    return warenkorb.reduce((sum, item) => sum + item.menge, 0);
  };

  const getGesamtpreis = () => {
    return warenkorb.reduce((sum, item) => sum + (item.preis * item.menge), 0);
  };

  const submitBestellung = async () => {
    if (warenkorb.length === 0) {
      toast({
        title: "Warenkorb leer",
        description: "Bitte fügen Sie Produkte zum Warenkorb hinzu.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Pflichtfelder fehlen",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Erstelle Bestellung
      const { data: bestellungData, error: bestellungError } = await supabase
        .from('simple_bestellungen_2025_10_31_12_00')
        .insert({
          name: formData.name,
          email: formData.email,
          telefon: formData.phone,
          adresse: formData.address,
          nachricht: formData.nachricht,
          gesamtpreis: getGesamtpreis(),
          status: 'neu',
          zahlungsstatus: 'offen',
          zahlungsart: 'bar'
        })
        .select()
        .single();

      if (bestellungError) throw bestellungError;

      // Erstelle Bestellpositionen
      const bestellpositionen = warenkorb.map(item => ({
        bestellung_id: bestellungData.id,
        produkt_name: item.produkt,
        menge: item.menge,
        einzelpreis: item.preis,
        gesamtpreis: item.preis * item.menge
      }));

      const { error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_10_31_12_00')
        .insert(bestellpositionen);

      if (positionenError) throw positionenError;

      toast({
        title: "Bestellung erfolgreich",
        description: "Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten eine Bestätigung per E-Mail.",
      });

      // Reset
      setWarenkorb([]);
      setFormData({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        nachricht: ''
      });

    } catch (error: any) {
      console.error('Bestellfehler:', error);
      toast({
        title: "Bestellfehler",
        description: error.message || "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Lade Sortiment...</div>
      </div>
    );
  }

  return (
    <div id="wildfleisch-shop" className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Wildfleisch-Sortiment</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Entdecken Sie unser hochwertiges Wildfleisch aus heimischen Wäldern. 
          Frisch, nachhaltig und von höchster Qualität.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Kategorien-Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Kategorien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {verfuegbareKategorien.map((kategorie) => {
                const produktCount = kategorie === 'Alle' 
                  ? wildfleischSortiment.length 
                  : produkteByKategorie[kategorie]?.length || 0;
                // Finde echte Kategorie-Info oder verwende Fallback
                const echteKategorie = kategorien.find(k => k.name === kategorie);
                const categoryInfo = echteKategorie ? {
                  icon: echteKategorie.icon || '📦',
                  farbe: echteKategorie.farbe || '#666666',
                  beschreibung: echteKategorie.beschreibung || ''
                } : (kategorie === 'Alle' ? { icon: '📦', farbe: '#666666', beschreibung: 'Alle Produkte' } : DEFAULT_CATEGORIES[kategorie as keyof typeof DEFAULT_CATEGORIES] || { icon: '📦', farbe: '#666666', beschreibung: '' });
                
                return (
                  <Button
                    key={kategorie}
                    variant={activeKategorie === kategorie ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => setActiveKategorie(kategorie)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl">
                        {kategorie === 'Alle' ? '📦' : categoryInfo?.icon || '📦'}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{kategorie}</div>
                        <div className="text-xs text-muted-foreground">
                          {produktCount} Produkte
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Warenkorb */}
          <Card className="mt-6">
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
                <p className="text-muted-foreground text-center py-4">
                  Warenkorb ist leer
                </p>
              ) : (
                <div className="space-y-4">
                  {warenkorb.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.produkt}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.preis.toFixed(2)}€/{item.einheit}
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
                          onClick={() => updateMenge(item.produkt, 0)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold">
                    <span>Gesamt:</span>
                    <span className="text-lg">{getGesamtpreis().toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Produkte */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Kategorie-Header */}
            {activeKategorie !== 'Alle' && (
              (() => {
                const echteKategorie = kategorien.find(k => k.name === activeKategorie);
                const categoryInfo = echteKategorie ? {
                  icon: echteKategorie.icon || '📦',
                  farbe: echteKategorie.farbe || '#666666',
                  beschreibung: echteKategorie.beschreibung || ''
                } : DEFAULT_CATEGORIES[activeKategorie as keyof typeof DEFAULT_CATEGORIES] || { icon: '📦', farbe: '#666666', beschreibung: '' };
                
                return (
                  <Card style={{ borderColor: categoryInfo?.farbe }}>
                    <CardHeader style={{ backgroundColor: `${categoryInfo?.farbe}15` }}>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-3xl">
                          {categoryInfo?.icon}
                        </span>
                    <div>
                      <h2 className="text-2xl">{activeKategorie}</h2>
                      <p className="text-muted-foreground font-normal">
                        {categoryInfo?.beschreibung}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
                );
              })()
            )}

            {/* Produkte Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gefilterteProdukte.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>Lagerbestand: {item.lagerbestand}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {item.preis.toFixed(2)}€
                          <span className="text-sm font-normal text-muted-foreground">
                            /{item.einheit}
                          </span>
                        </div>
                        
                        <Button
                          onClick={() => addToWarenkorb(item)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Hinzufügen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {gefilterteProdukte.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Keine Produkte verfügbar</h3>
                  <p className="text-muted-foreground">
                    In dieser Kategorie sind derzeit keine Produkte verfügbar.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bestellformular */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
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
                <Label htmlFor="phone">Telefon *</Label>
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
                  placeholder="Ihre Adresse (optional)"
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
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Artikel:</span>
                  <span>{getWarenkorbCount()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Gesamt:</span>
                  <span>{getGesamtpreis().toFixed(2)}€</span>
                </div>
              </div>
              
              <Button
                onClick={submitBestellung}
                disabled={submitting || warenkorb.length === 0}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Wird verarbeitet...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Bestellung aufgeben
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                * Pflichtfelder. Nach der Bestellung erhalten Sie eine Bestätigung per E-Mail.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};