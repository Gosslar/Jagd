import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Package, 
  Tag,
  ShoppingCart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ShopKategorie {
  id: string;
  name: string;
  beschreibung: string;
  bild_url: string;
  farbe: string;
  reihenfolge: number;
  aktiv: boolean;
  sichtbar_fuer_kunden: boolean;
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
  mindestbestand: number;
  verfuegbar: boolean;
  reihenfolge: number;
  aktiv: boolean;
  sichtbar_fuer_kunden: boolean;
  hauptbild_url: string;
  herkunft: string;
  haltbarkeit_tage: number;
  lagerung_hinweise: string;
  zubereitungs_hinweise: string;
}

export const ShopVerwaltung = () => {
  const { toast } = useToast();
  const [kategorien, setKategorien] = useState<ShopKategorie[]>([]);
  const [produkte, setProdukte] = useState<ShopProdukt[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog States
  const [kategorieDialog, setKategorieDialog] = useState(false);
  const [produktDialog, setProduktDialog] = useState(false);
  const [editingKategorie, setEditingKategorie] = useState<ShopKategorie | null>(null);
  const [editingProdukt, setEditingProdukt] = useState<ShopProdukt | null>(null);
  
  // Form States
  const [kategorieForm, setKategorieForm] = useState({
    name: '',
    beschreibung: '',
    bild_url: '',
    farbe: '#10b981',
    aktiv: true,
    sichtbar_fuer_kunden: true
  });
  
  const [produktForm, setProduktForm] = useState({
    kategorie_id: '',
    name: '',
    beschreibung: '',
    kurzbeschreibung: '',
    preis: 0,
    einheit: 'Stück',
    gewicht: 0,
    lagerbestand: 0,
    mindestbestand: 0,
    aktiv: true,
    sichtbar_fuer_kunden: true,
    hauptbild_url: '',
    herkunft: '',
    haltbarkeit_tage: 7,
    lagerung_hinweise: '',
    zubereitungs_hinweise: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

  // Kategorie-Funktionen
  const saveKategorie = async () => {
    try {
      if (editingKategorie) {
        // Update
        const { error } = await supabase
          .from('shop_kategorien_2025_10_27_14_00')
          .update(kategorieForm)
          .eq('id', editingKategorie.id);
        
        if (error) throw error;
        
        toast({
          title: "Kategorie aktualisiert",
          description: "Die Kategorie wurde erfolgreich aktualisiert.",
        });
      } else {
        // Insert
        const maxReihenfolge = Math.max(...kategorien.map(k => k.reihenfolge), 0);
        const { error } = await supabase
          .from('shop_kategorien_2025_10_27_14_00')
          .insert({
            ...kategorieForm,
            reihenfolge: maxReihenfolge + 1
          });
        
        if (error) throw error;
        
        toast({
          title: "Kategorie erstellt",
          description: "Die neue Kategorie wurde erfolgreich erstellt.",
        });
      }
      
      resetKategorieForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteKategorie = async (id: string) => {
    if (!confirm('Kategorie wirklich löschen? Produkte werden auf "Ohne Kategorie" gesetzt.')) return;
    
    try {
      const { error } = await supabase
        .from('shop_kategorien_2025_10_27_14_00')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Kategorie gelöscht",
        description: "Die Kategorie wurde erfolgreich gelöscht.",
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveKategorie = async (id: string, direction: 'up' | 'down') => {
    const kategorie = kategorien.find(k => k.id === id);
    if (!kategorie) return;
    
    const newPosition = direction === 'up' ? kategorie.reihenfolge - 1 : kategorie.reihenfolge + 1;
    
    try {
      const { error } = await supabase.rpc('move_shop_category_position', {
        category_id: id,
        new_position: newPosition
      });
      
      if (error) throw error;
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Verschieben",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Produkt-Funktionen
  const saveProdukt = async () => {
    try {
      if (editingProdukt) {
        // Update
        const { error } = await supabase
          .from('shop_produkte_2025_10_27_14_00')
          .update(produktForm)
          .eq('id', editingProdukt.id);
        
        if (error) throw error;
        
        toast({
          title: "Produkt aktualisiert",
          description: "Das Produkt wurde erfolgreich aktualisiert.",
        });
      } else {
        // Insert
        const kategorieProdukteCount = produkte.filter(p => p.kategorie_id === produktForm.kategorie_id).length;
        const { error } = await supabase
          .from('shop_produkte_2025_10_27_14_00')
          .insert({
            ...produktForm,
            reihenfolge: kategorieProdukteCount + 1
          });
        
        if (error) throw error;
        
        toast({
          title: "Produkt erstellt",
          description: "Das neue Produkt wurde erfolgreich erstellt.",
        });
      }
      
      resetProduktForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteProdukt = async (id: string) => {
    if (!confirm('Produkt wirklich löschen?')) return;
    
    try {
      const { error } = await supabase
        .from('shop_produkte_2025_10_27_14_00')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Produkt gelöscht",
        description: "Das Produkt wurde erfolgreich gelöscht.",
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveProdukt = async (id: string, direction: 'up' | 'down', targetKategorieId?: string) => {
    const produkt = produkte.find(p => p.id === id);
    if (!produkt) return;
    
    const newPosition = direction === 'up' ? produkt.reihenfolge - 1 : produkt.reihenfolge + 1;
    
    try {
      const { error } = await supabase.rpc('move_shop_product_position', {
        product_id: id,
        new_position: newPosition,
        target_category_id: targetKategorieId || produkt.kategorie_id
      });
      
      if (error) throw error;
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Verschieben",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Form Reset Funktionen
  const resetKategorieForm = () => {
    setKategorieForm({
      name: '',
      beschreibung: '',
      bild_url: '',
      farbe: '#10b981',
      aktiv: true,
      sichtbar_fuer_kunden: true
    });
    setEditingKategorie(null);
    setKategorieDialog(false);
  };

  const resetProduktForm = () => {
    setProduktForm({
      kategorie_id: '',
      name: '',
      beschreibung: '',
      kurzbeschreibung: '',
      preis: 0,
      einheit: 'Stück',
      gewicht: 0,
      lagerbestand: 0,
      mindestbestand: 0,
      aktiv: true,
      sichtbar_fuer_kunden: true,
      hauptbild_url: '',
      herkunft: '',
      haltbarkeit_tage: 7,
      lagerung_hinweise: '',
      zubereitungs_hinweise: ''
    });
    setEditingProdukt(null);
    setProduktDialog(false);
  };

  // Edit-Funktionen
  const editKategorie = (kategorie: ShopKategorie) => {
    setEditingKategorie(kategorie);
    setKategorieForm({
      name: kategorie.name,
      beschreibung: kategorie.beschreibung || '',
      bild_url: kategorie.bild_url || '',
      farbe: kategorie.farbe,
      aktiv: kategorie.aktiv,
      sichtbar_fuer_kunden: kategorie.sichtbar_fuer_kunden
    });
    setKategorieDialog(true);
  };

  const editProdukt = (produkt: ShopProdukt) => {
    setEditingProdukt(produkt);
    setProduktForm({
      kategorie_id: produkt.kategorie_id || '',
      name: produkt.name,
      beschreibung: produkt.beschreibung || '',
      kurzbeschreibung: produkt.kurzbeschreibung || '',
      preis: produkt.preis,
      einheit: produkt.einheit,
      gewicht: produkt.gewicht || 0,
      lagerbestand: produkt.lagerbestand,
      mindestbestand: produkt.mindestbestand,
      aktiv: produkt.aktiv,
      sichtbar_fuer_kunden: produkt.sichtbar_fuer_kunden,
      hauptbild_url: produkt.hauptbild_url || '',
      herkunft: produkt.herkunft || '',
      haltbarkeit_tage: produkt.haltbarkeit_tage || 7,
      lagerung_hinweise: produkt.lagerung_hinweise || '',
      zubereitungs_hinweise: produkt.zubereitungs_hinweise || ''
    });
    setProduktDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Lade Shop-Daten...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Erweiterte Shop-Verwaltung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kategorien" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kategorien" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Kategorien ({kategorien.length})
              </TabsTrigger>
              <TabsTrigger value="produkte" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produkte ({produkte.length})
              </TabsTrigger>
            </TabsList>

            {/* Kategorien Tab */}
            <TabsContent value="kategorien" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Kategorien verwalten</h3>
                <Dialog open={kategorieDialog} onOpenChange={setKategorieDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetKategorieForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Neue Kategorie
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingKategorie ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="kategorie-name">Name</Label>
                        <Input
                          id="kategorie-name"
                          value={kategorieForm.name}
                          onChange={(e) => setKategorieForm({...kategorieForm, name: e.target.value})}
                          placeholder="z.B. Rehwild"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kategorie-beschreibung">Beschreibung</Label>
                        <Textarea
                          id="kategorie-beschreibung"
                          value={kategorieForm.beschreibung}
                          onChange={(e) => setKategorieForm({...kategorieForm, beschreibung: e.target.value})}
                          placeholder="Beschreibung der Kategorie"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kategorie-farbe">Farbe</Label>
                        <Input
                          id="kategorie-farbe"
                          type="color"
                          value={kategorieForm.farbe}
                          onChange={(e) => setKategorieForm({...kategorieForm, farbe: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="kategorie-aktiv"
                          checked={kategorieForm.aktiv}
                          onChange={(e) => setKategorieForm({...kategorieForm, aktiv: e.target.checked})}
                        />
                        <Label htmlFor="kategorie-aktiv">Aktiv</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="kategorie-sichtbar"
                          checked={kategorieForm.sichtbar_fuer_kunden}
                          onChange={(e) => setKategorieForm({...kategorieForm, sichtbar_fuer_kunden: e.target.checked})}
                        />
                        <Label htmlFor="kategorie-sichtbar">Für Kunden sichtbar</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveKategorie} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Speichern
                        </Button>
                        <Button variant="outline" onClick={resetKategorieForm}>
                          <X className="h-4 w-4 mr-2" />
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {kategorien.map((kategorie, index) => (
                  <Card key={kategorie.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: kategorie.farbe }}
                        />
                        <div>
                          <h4 className="font-medium">{kategorie.name}</h4>
                          <p className="text-sm text-gray-600">{kategorie.beschreibung}</p>
                        </div>
                        <div className="flex gap-1">
                          {kategorie.aktiv ? (
                            <Badge variant="default">Aktiv</Badge>
                          ) : (
                            <Badge variant="secondary">Inaktiv</Badge>
                          )}
                          {kategorie.sichtbar_fuer_kunden && (
                            <Badge variant="outline">Sichtbar</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveKategorie(kategorie.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveKategorie(kategorie.id, 'down')}
                          disabled={index === kategorien.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editKategorie(kategorie)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteKategorie(kategorie.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Produkte Tab */}
            <TabsContent value="produkte" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Produkte verwalten</h3>
                <Dialog open={produktDialog} onOpenChange={setProduktDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetProduktForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Neues Produkt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProdukt ? 'Produkt bearbeiten' : 'Neues Produkt'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="produkt-name">Produktname</Label>
                          <Input
                            id="produkt-name"
                            value={produktForm.name}
                            onChange={(e) => setProduktForm({...produktForm, name: e.target.value})}
                            placeholder="z.B. Rehhack"
                          />
                        </div>
                        <div>
                          <Label htmlFor="produkt-kategorie">Kategorie</Label>
                          <Select
                            value={produktForm.kategorie_id}
                            onValueChange={(value) => setProduktForm({...produktForm, kategorie_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Kategorie wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {kategorien.map((kategorie) => (
                                <SelectItem key={kategorie.id} value={kategorie.id}>
                                  {kategorie.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="produkt-kurzbeschreibung">Kurzbeschreibung</Label>
                        <Input
                          id="produkt-kurzbeschreibung"
                          value={produktForm.kurzbeschreibung}
                          onChange={(e) => setProduktForm({...produktForm, kurzbeschreibung: e.target.value})}
                          placeholder="Kurze Produktbeschreibung"
                        />
                      </div>

                      <div>
                        <Label htmlFor="produkt-beschreibung">Detailbeschreibung</Label>
                        <Textarea
                          id="produkt-beschreibung"
                          value={produktForm.beschreibung}
                          onChange={(e) => setProduktForm({...produktForm, beschreibung: e.target.value})}
                          placeholder="Ausführliche Produktbeschreibung"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="produkt-preis">Preis (€)</Label>
                          <Input
                            id="produkt-preis"
                            type="number"
                            step="0.01"
                            value={produktForm.preis}
                            onChange={(e) => setProduktForm({...produktForm, preis: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="produkt-einheit">Einheit</Label>
                          <Input
                            id="produkt-einheit"
                            value={produktForm.einheit}
                            onChange={(e) => setProduktForm({...produktForm, einheit: e.target.value})}
                            placeholder="z.B. 500g, je Kg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="produkt-gewicht">Gewicht (kg)</Label>
                          <Input
                            id="produkt-gewicht"
                            type="number"
                            step="0.001"
                            value={produktForm.gewicht}
                            onChange={(e) => setProduktForm({...produktForm, gewicht: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="produkt-lagerbestand">Lagerbestand</Label>
                          <Input
                            id="produkt-lagerbestand"
                            type="number"
                            value={produktForm.lagerbestand}
                            onChange={(e) => setProduktForm({...produktForm, lagerbestand: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="produkt-mindestbestand">Mindestbestand</Label>
                          <Input
                            id="produkt-mindestbestand"
                            type="number"
                            value={produktForm.mindestbestand}
                            onChange={(e) => setProduktForm({...produktForm, mindestbestand: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="produkt-herkunft">Herkunft</Label>
                          <Input
                            id="produkt-herkunft"
                            value={produktForm.herkunft}
                            onChange={(e) => setProduktForm({...produktForm, herkunft: e.target.value})}
                            placeholder="z.B. Weetzen, Niedersachsen"
                          />
                        </div>
                        <div>
                          <Label htmlFor="produkt-haltbarkeit">Haltbarkeit (Tage)</Label>
                          <Input
                            id="produkt-haltbarkeit"
                            type="number"
                            value={produktForm.haltbarkeit_tage}
                            onChange={(e) => setProduktForm({...produktForm, haltbarkeit_tage: parseInt(e.target.value) || 7})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="produkt-lagerung">Lagerungshinweise</Label>
                        <Textarea
                          id="produkt-lagerung"
                          value={produktForm.lagerung_hinweise}
                          onChange={(e) => setProduktForm({...produktForm, lagerung_hinweise: e.target.value})}
                          placeholder="z.B. Bei 2-4°C lagern"
                        />
                      </div>

                      <div>
                        <Label htmlFor="produkt-zubereitung">Zubereitungshinweise</Label>
                        <Textarea
                          id="produkt-zubereitung"
                          value={produktForm.zubereitungs_hinweise}
                          onChange={(e) => setProduktForm({...produktForm, zubereitungs_hinweise: e.target.value})}
                          placeholder="z.B. Vor Zubereitung auftauen lassen"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="produkt-aktiv"
                            checked={produktForm.aktiv}
                            onChange={(e) => setProduktForm({...produktForm, aktiv: e.target.checked})}
                          />
                          <Label htmlFor="produkt-aktiv">Aktiv</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="produkt-sichtbar"
                            checked={produktForm.sichtbar_fuer_kunden}
                            onChange={(e) => setProduktForm({...produktForm, sichtbar_fuer_kunden: e.target.checked})}
                          />
                          <Label htmlFor="produkt-sichtbar">Für Kunden sichtbar</Label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={saveProdukt} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Speichern
                        </Button>
                        <Button variant="outline" onClick={resetProduktForm}>
                          <X className="h-4 w-4 mr-2" />
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Produkte nach Kategorien gruppiert anzeigen */}
              {kategorien.map((kategorie) => {
                const kategorieProdukteList = produkte.filter(p => p.kategorie_id === kategorie.id);
                if (kategorieProdukteList.length === 0) return null;

                return (
                  <Card key={kategorie.id} className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: kategorie.farbe }}
                      />
                      {kategorie.name} ({kategorieProdukteList.length})
                    </h4>
                    <div className="space-y-2">
                      {kategorieProdukteList.map((produkt, index) => (
                        <div key={produkt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <div>
                              <h5 className="font-medium">{produkt.name}</h5>
                              <p className="text-sm text-gray-600">
                                {produkt.preis.toFixed(2)}€ / {produkt.einheit}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              {produkt.lagerbestand <= produkt.mindestbestand ? (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Niedrig ({produkt.lagerbestand})
                                </Badge>
                              ) : (
                                <Badge variant="default" className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Verfügbar ({produkt.lagerbestand})
                                </Badge>
                              )}
                              {!produkt.aktiv && <Badge variant="secondary">Inaktiv</Badge>}
                              {!produkt.sichtbar_fuer_kunden && <Badge variant="outline">Versteckt</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveProdukt(produkt.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveProdukt(produkt.id, 'down')}
                              disabled={index === kategorieProdukteList.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editProdukt(produkt)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProdukt(produkt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}

              {/* Produkte ohne Kategorie */}
              {(() => {
                const produkteOhneKategorie = produkte.filter(p => !p.kategorie_id);
                if (produkteOhneKategorie.length === 0) return null;

                return (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-gray-600">
                      Ohne Kategorie ({produkteOhneKategorie.length})
                    </h4>
                    <div className="space-y-2">
                      {produkteOhneKategorie.map((produkt) => (
                        <div key={produkt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <div>
                              <h5 className="font-medium">{produkt.name}</h5>
                              <p className="text-sm text-gray-600">
                                {produkt.preis.toFixed(2)}€ / {produkt.einheit}
                              </p>
                            </div>
                            <Badge variant="outline">Keine Kategorie</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editProdukt(produkt)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProdukt(produkt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};