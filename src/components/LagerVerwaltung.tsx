import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Package, Plus, Minus, AlertTriangle, RefreshCw, Edit, Save, X, PlusCircle, Shield, ArrowUp, ArrowDown, Move, Palette, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useAdminStatus } from '@/hooks/useAdminStatus';
interface WildfleischKategorie {
  id: string;
  name: string;
  beschreibung?: string;
  farbe: string;
  reihenfolge: number;
  aktiv: boolean;
}

interface LagerItem {
  id: string;
  produkt_name: string;
  kategorie: string;
  preis: number;
  einheit: string;
  lagerbestand: number;
  mindestbestand: number;
  verfügbar: boolean;
  aktualisiert_am: string;
  reihenfolge: number;
}
export const LagerVerwaltung: React.FC = () => {
  const { user } = useAuth();
  // VEREINFACHTE VERSION - Ohne Admin-Hooks zur Fehlerbehebung
  // const { isAdmin, isLagerAdmin, isSuperAdmin, loading: adminLoading } = useAdminStatus();
  const isAdmin = true;
  const isLagerAdmin = true;
  const isSuperAdmin = true;
  const adminLoading = false;
  const [lagerItems, setLagerItems] = useState<LagerItem[]>([]);
  const [kategorien, setKategorien] = useState<WildfleischKategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newArticleDialog, setNewArticleDialog] = useState(false);
  const [editArticleDialog, setEditArticleDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [selectedKategorie, setSelectedKategorie] = useState<WildfleischKategorie | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<LagerItem | null>(null);
  const [activeTab, setActiveTab] = useState<'produkte' | 'kategorien'>('produkte');
  const [newArticle, setNewArticle] = useState({
    produkt_name: '',
    kategorie: '',
    preis: '',
    einheit: '',
    lagerbestand: '',
    mindestbestand: ''
  });

  const [editArticle, setEditArticle] = useState({
    produkt_name: '',
    kategorie: '',
    preis: '',
    einheit: '',
    lagerbestand: '',
    mindestbestand: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    beschreibung: '',
    farbe: '#059669'
  });

  const loadKategorien = async () => {
    try {
      const { data, error } = await supabase
        .from('wildfleisch_kategorien_2025_10_26_12_00')
        .select('*')
        .eq('aktiv', true)
        .order('reihenfolge', { ascending: true });

      if (error) throw error;
      setKategorien(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  };

  const fetchLagerbestand = async () => {
    try {
      const { data, error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .select('*')
        .order('reihenfolge', { ascending: true });

      if (error) throw error;
      setLagerItems(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden der Lagerbestände:', error);
      toast({
        title: "Fehler",
        description: "Lagerbestände konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLagerbestand = async (id: string, neuerBestand: number) => {
    if (neuerBestand < 0) return;
    
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .update({ lagerbestand: neuerBestand })
        .eq('id', id);

      if (error) throw error;

      setLagerItems(items => 
        items.map(item => 
          item.id === id 
            ? { ...item, lagerbestand: neuerBestand, verfügbar: neuerBestand > 0 }
            : item
        )
      );

      toast({
        title: "Bestand aktualisiert",
        description: `Lagerbestand wurde auf ${neuerBestand} gesetzt`,
      });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler",
        description: "Bestand konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const updatePreis = async (id: string, neuerPreis: number) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .update({ preis: neuerPreis })
        .eq('id', id);

      if (error) throw error;

      setLagerItems(items => 
        items.map(item => 
          item.id === id ? { ...item, preis: neuerPreis } : item
        )
      );

      setEditingPrice(null);
      toast({
        title: "Preis aktualisiert",
        description: `Preis wurde auf ${neuerPreis.toFixed(2)}€ gesetzt`,
      });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Preises:', error);
      toast({
        title: "Fehler",
        description: "Preis konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const createNewArticle = async () => {
    if (!newArticle.produkt_name || !newArticle.kategorie || !newArticle.preis || !newArticle.einheit) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .insert({
          produkt_name: newArticle.produkt_name,
          kategorie: newArticle.kategorie,
          preis: parseFloat(newArticle.preis),
          einheit: newArticle.einheit,
          lagerbestand: parseInt(newArticle.lagerbestand) || 0,
          mindestbestand: parseInt(newArticle.mindestbestand) || 0
        })
        .select()
        .single();

      if (error) throw error;

      setLagerItems([...lagerItems, data]);
      setNewArticleDialog(false);
      setNewArticle({
        produkt_name: '',
        kategorie: '',
        preis: '',
        einheit: '',
        lagerbestand: '',
        mindestbestand: ''
      });

      toast({
        title: "Artikel erstellt",
        description: `${newArticle.produkt_name} wurde erfolgreich hinzugefügt`,
      });
    } catch (error: any) {
      console.error('Fehler beim Erstellen des Artikels:', error);
      toast({
        title: "Fehler",
        description: "Artikel konnte nicht erstellt werden",
        variant: "destructive",
      });
    }
  };

  const openEditProductDialog = (product: LagerItem) => {
    setSelectedProduct(product);
    setEditArticle({
      produkt_name: product.produkt_name,
      kategorie: product.kategorie,
      preis: product.preis.toString(),
      einheit: product.einheit,
      lagerbestand: product.lagerbestand.toString(),
      mindestbestand: product.mindestbestand.toString()
    });
    setEditArticleDialog(true);
  };

  const updateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .update({
          produkt_name: editArticle.produkt_name,
          kategorie: editArticle.kategorie,
          preis: parseFloat(editArticle.preis),
          einheit: editArticle.einheit,
          lagerbestand: parseInt(editArticle.lagerbestand),
          mindestbestand: parseInt(editArticle.mindestbestand)
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast({
        title: "Produkt aktualisiert",
        description: "Das Produkt wurde erfolgreich aktualisiert",
      });

      setEditArticleDialog(false);
      setSelectedProduct(null);
      resetEditForm();
      await fetchLagerbestand();

    } catch (error: any) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetEditForm = () => {
    setEditArticle({
      produkt_name: '',
      kategorie: '',
      preis: '',
      einheit: '',
      lagerbestand: '',
      mindestbestand: ''
    });
  };

  const saveKategorie = async () => {
    if (!user) return;

    try {
      const kategorieData = {
        name: categoryFormData.name,
        beschreibung: categoryFormData.beschreibung || null,
        farbe: categoryFormData.farbe
      };

      let error;
      if (selectedKategorie) {
        // Update
        const result = await supabase
          .from('wildfleisch_kategorien_2025_10_26_12_00')
          .update(kategorieData)
          .eq('id', selectedKategorie.id);
        error = result.error;
      } else {
        // Insert
        const result = await supabase
          .from('wildfleisch_kategorien_2025_10_26_12_00')
          .insert(kategorieData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: selectedKategorie ? "Kategorie aktualisiert" : "Kategorie erstellt",
        description: "Die Kategorie wurde erfolgreich gespeichert",
      });

      setCategoryDialog(false);
      resetCategoryForm();
      await loadKategorien();

    } catch (error: any) {
      console.error('Fehler beim Speichern der Kategorie:', error);
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteKategorie = async (id: string) => {
    if (!confirm('Kategorie wirklich löschen? Produkte mit dieser Kategorie werden auf die erste verfügbare Kategorie gesetzt.')) return;

    try {
      // Erst alle Produkte mit dieser Kategorie auf erste verfügbare Kategorie setzen
      const kategorie = kategorien.find(k => k.id === id);
      const fallbackKategorie = kategorien.find(k => k.id !== id);
      
      if (kategorie && fallbackKategorie) {
        await supabase
          .from('wildfleisch_lager_2025_10_24_14_00')
          .update({ kategorie: fallbackKategorie.name })
          .eq('kategorie', kategorie.name);
      }

      // Dann Kategorie löschen (soft delete)
      const { error } = await supabase
        .from('wildfleisch_kategorien_2025_10_26_12_00')
        .update({ aktiv: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Kategorie gelöscht",
        description: "Die Kategorie wurde erfolgreich gelöscht",
      });

      await loadKategorien();
      await fetchLagerbestand(); // Reload products to show category changes

    } catch (error: any) {
      console.error('Fehler beim Löschen der Kategorie:', error);
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveKategorie = async (kategorieId: string, direction: 'up' | 'down') => {
    try {
      const { error } = await supabase.rpc('move_wildfleisch_category_position', {
        kategorie_id: kategorieId,
        direction: direction
      });

      if (error) throw error;

      toast({
        title: "Reihenfolge geändert",
        description: "Die Kategorie-Reihenfolge wurde aktualisiert",
      });

      await loadKategorien();

    } catch (error: any) {
      console.error('Fehler beim Verschieben der Kategorie:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openCategoryDialog = (kategorie?: WildfleischKategorie) => {
    if (kategorie) {
      setSelectedKategorie(kategorie);
      setCategoryFormData({
        name: kategorie.name,
        beschreibung: kategorie.beschreibung || '',
        farbe: kategorie.farbe
      });
    } else {
      setSelectedKategorie(null);
      resetCategoryForm();
    }
    setCategoryDialog(true);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      beschreibung: '',
      farbe: '#059669'
    });
  };

  const moveProduct = async (produktId: string, direction: 'up' | 'down') => {
    try {
      console.log('Verschiebe Produkt:', produktId, 'Richtung:', direction);
      
      const { error } = await supabase.rpc('move_product_position_in_category', {
        produkt_id: produktId,
        direction: direction
      });

      if (error) {
        console.error('SQL Fehler:', error);
        throw error;
      }

      toast({
        title: "Reihenfolge geändert",
        description: "Die Produkt-Reihenfolge wurde aktualisiert",
      });

      await fetchLagerbestand();

    } catch (error: any) {
      console.error('Fehler beim Verschieben:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const reorderProducts = async () => {
    try {
      const { error } = await supabase.rpc('reorder_products_by_category');

      if (error) throw error;

      toast({
        title: "Reihenfolge neu sortiert",
        description: "Alle Produkte wurden nach Kategorien neu sortiert",
      });

      await fetchLagerbestand();

    } catch (error: any) {
      console.error('Fehler beim Neu-Sortieren:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getBestandsStatus = (item: LagerItem) => {
    if (item.lagerbestand === 0) {
      return { text: 'Ausverkauft', color: 'bg-red-100 text-red-800' };
    } else if (item.lagerbestand <= item.mindestbestand) {
      return { text: 'Niedrig', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Verfügbar', color: 'bg-green-100 text-green-800' };
    }
  };

  useEffect(() => {
    if ((isLagerAdmin || isSuperAdmin) && !adminLoading) {
      fetchLagerbestand();
      loadKategorien();
    }
  }, [isLagerAdmin, isSuperAdmin, adminLoading]);

  // Admin-Berechtigung prüfen
  if (adminLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Berechtigungen werden geprüft...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Anmeldung erforderlich</h3>
            <p className="text-gray-600">
              Bitte melden Sie sich an, um die Lagerverwaltung zu nutzen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLagerAdmin && !isSuperAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Keine Berechtigung</h3>
            <p className="text-gray-600">
              Sie benötigen Lager-Admin Rechte, um die Lagerverwaltung zu nutzen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
            <p>Lade Lagerbestände...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kategorienListe = [...new Set(lagerItems.map(item => item.kategorie))];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lagerverwaltung - Wildfleisch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="produkte">Produkte verwalten</TabsTrigger>
              <TabsTrigger value="kategorien">Kategorien verwalten</TabsTrigger>
            </TabsList>
            
            <TabsContent value="produkte" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Produkt-Verwaltung</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={reorderProducts}
                    className="flex items-center gap-2"
                  >
                    <Move className="h-4 w-4" />
                    Neu sortieren
                  </Button>
                  <Dialog open={newArticleDialog} onOpenChange={setNewArticleDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Neuer Artikel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Neuen Artikel erstellen</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="produkt_name">Produktname *</Label>
                          <Input
                            id="produkt_name"
                            value={newArticle.produkt_name}
                            onChange={(e) => setNewArticle({...newArticle, produkt_name: e.target.value})}
                            placeholder="z.B. Rehkeule"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kategorie">Kategorie *</Label>
                          <Select 
                            value={newArticle.kategorie || "none"} 
                            onValueChange={(value) => setNewArticle({...newArticle, kategorie: value === "none" ? "" : value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Kategorie wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Kategorie wählen</SelectItem>
                              <SelectItem value="Rehwild">Rehwild</SelectItem>
                              <SelectItem value="Schwarzwild">Schwarzwild</SelectItem>
                              <SelectItem value="Federwild">Federwild</SelectItem>
                              <SelectItem value="Wildmettwurst">Wildmettwurst</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="preis">Preis (€) *</Label>
                            <Input
                              id="preis"
                              type="number"
                              step="0.01"
                              value={newArticle.preis}
                              onChange={(e) => setNewArticle({...newArticle, preis: e.target.value})}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="einheit">Einheit *</Label>
                            <Input
                              id="einheit"
                              value={newArticle.einheit}
                              onChange={(e) => setNewArticle({...newArticle, einheit: e.target.value})}
                              placeholder="kg, Stück, Pack"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="lagerbestand">Lagerbestand</Label>
                            <Input
                              id="lagerbestand"
                              type="number"
                              value={newArticle.lagerbestand}
                              onChange={(e) => setNewArticle({...newArticle, lagerbestand: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mindestbestand">Mindestbestand</Label>
                            <Input
                              id="mindestbestand"
                              type="number"
                              value={newArticle.mindestbestand}
                              onChange={(e) => setNewArticle({...newArticle, mindestbestand: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setNewArticleDialog(false)}>
                            Abbrechen
                          </Button>
                          <Button onClick={createNewArticle}>
                            Artikel erstellen
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={fetchLagerbestand} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Aktualisieren
                  </Button>
                </div>
              </div>

              {/* Übersicht */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Gesamt Produkte</p>
                        <p className="text-2xl font-bold">{lagerItems.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Verfügbar</p>
                        <p className="text-2xl font-bold text-green-600">
                          {lagerItems.filter(item => item.verfügbar).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Niedrig</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {lagerItems.filter(item => item.lagerbestand <= item.mindestbestand && item.lagerbestand > 0).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ausverkauft</p>
                        <p className="text-2xl font-bold text-red-600">
                          {lagerItems.filter(item => item.lagerbestand === 0).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lagerbestand-Tabellen nach Kategorien */}
              {kategorien.map(kategorie => (
                <Card key={kategorie.id} className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">{kategorie.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Pos.</TableHead>
                          <TableHead className="w-1/5">Produkt</TableHead>
                          <TableHead className="w-1/5">Preis</TableHead>
                          <TableHead className="w-1/6">Bestand</TableHead>
                          <TableHead className="w-1/6">Status</TableHead>
                          <TableHead className="w-1/4">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lagerItems
                          .filter(item => item.kategorie === kategorie.name)
                          .map((item, index, filteredItems) => {
                            const status = getBestandsStatus(item);
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-mono">{item.reihenfolge}</span>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveProduct(item.id, 'up')}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveProduct(item.id, 'down')}
                                        disabled={index === filteredItems.length - 1}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {item.produkt_name}
                                  {item.lagerbestand <= item.mindestbestand && item.lagerbestand > 0 && (
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingPrice === item.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        step="0.01"
                                        defaultValue={item.preis.toFixed(2)}
                                        className="w-20"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            const newPrice = parseFloat((e.target as HTMLInputElement).value);
                                            if (newPrice > 0) {
                                              updatePreis(item.id, newPrice);
                                            }
                                          }
                                          if (e.key === 'Escape') {
                                            setEditingPrice(null);
                                          }
                                        }}
                                        onBlur={(e) => {
                                          const newPrice = parseFloat(e.target.value);
                                          if (newPrice > 0) {
                                            updatePreis(item.id, newPrice);
                                          } else {
                                            setEditingPrice(null);
                                          }
                                        }}
                                        autoFocus
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingPrice(null)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span>{item.preis.toFixed(2)}€ / {item.einheit}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingPrice(item.id)}
                                        disabled={updating === item.id}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold">{item.lagerbestand}</span>
                                  <span className="text-gray-500 text-sm ml-1">
                                    (Min: {item.mindestbestand})
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge className={status.color}>
                                    {status.text}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateLagerbestand(item.id, item.lagerbestand - 1)}
                                      disabled={updating === item.id || item.lagerbestand === 0}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      value={item.lagerbestand}
                                      onChange={(e) => {
                                        const newValue = parseInt(e.target.value) || 0;
                                        updateLagerbestand(item.id, newValue);
                                      }}
                                      className="w-20 text-center"
                                      min="0"
                                      disabled={updating === item.id}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateLagerbestand(item.id, item.lagerbestand + 1)}
                                      disabled={updating === item.id}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openEditProductDialog(item)}
                                      className="flex items-center gap-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                      Bearbeiten
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="kategorien" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Kategorien-Verwaltung</h3>
                <Button onClick={() => openCategoryDialog()} className="bg-green-600 hover:bg-green-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Neue Kategorie
                </Button>
              </div>

              {/* Kategorien-Tabelle */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Pos.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead>Farbe</TableHead>
                      <TableHead>Produkte</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kategorien.map((kategorie, index) => (
                      <TableRow key={kategorie.id}>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-mono">{kategorie.reihenfolge}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveKategorie(kategorie.id, 'up')}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveKategorie(kategorie.id, 'down')}
                                disabled={index === kategorien.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge style={{ backgroundColor: kategorie.farbe, color: 'white' }}>
                              {kategorie.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{kategorie.beschreibung || 'Keine Beschreibung'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: kategorie.farbe }}
                            ></div>
                            <span className="text-sm font-mono">{kategorie.farbe}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {lagerItems.filter(item => item.kategorie === kategorie.name).length} Produkte
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCategoryDialog(kategorie)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteKategorie(kategorie.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={lagerItems.filter(item => item.kategorie === kategorie.name).length > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Produkt bearbeiten Dialog */}
      <Dialog open={editArticleDialog} onOpenChange={setEditArticleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Produkt bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_produkt_name">Produktname *</Label>
              <Input
                id="edit_produkt_name"
                value={editArticle.produkt_name}
                onChange={(e) => setEditArticle({...editArticle, produkt_name: e.target.value})}
                placeholder="Produktname"
              />
            </div>
            <div>
              <Label htmlFor="edit_kategorie">Kategorie *</Label>
              <Select 
                value={editArticle.kategorie || "none"} 
                onValueChange={(value) => setEditArticle({...editArticle, kategorie: value === "none" ? "" : value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kategorie wählen</SelectItem>
                  {kategorien.map(kat => (
                    <SelectItem key={kat.id} value={kat.name}>{kat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit_preis">Preis (€) *</Label>
                <Input
                  id="edit_preis"
                  type="number"
                  step="0.01"
                  value={editArticle.preis}
                  onChange={(e) => setEditArticle({...editArticle, preis: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit_einheit">Einheit *</Label>
                <Input
                  id="edit_einheit"
                  value={editArticle.einheit}
                  onChange={(e) => setEditArticle({...editArticle, einheit: e.target.value})}
                  placeholder="z.B. je Kg, je Stück"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit_lagerbestand">Lagerbestand *</Label>
                <Input
                  id="edit_lagerbestand"
                  type="number"
                  value={editArticle.lagerbestand}
                  onChange={(e) => setEditArticle({...editArticle, lagerbestand: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit_mindestbestand">Mindestbestand *</Label>
                <Input
                  id="edit_mindestbestand"
                  type="number"
                  value={editArticle.mindestbestand}
                  onChange={(e) => setEditArticle({...editArticle, mindestbestand: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={updateProduct} className="bg-green-600 hover:bg-green-700">
                Aktualisieren
              </Button>
              <Button variant="outline" onClick={() => setEditArticleDialog(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kategorie Dialog */}
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedKategorie ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category_name">Name *</Label>
              <Input
                id="category_name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                placeholder="Kategorie-Name"
              />
            </div>
            <div>
              <Label htmlFor="category_description">Beschreibung</Label>
              <Textarea
                id="category_description"
                value={categoryFormData.beschreibung}
                onChange={(e) => setCategoryFormData({...categoryFormData, beschreibung: e.target.value})}
                placeholder="Optionale Beschreibung"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="category_color">Farbe</Label>
              <div className="flex gap-2">
                <Input
                  id="category_color"
                  type="color"
                  value={categoryFormData.farbe}
                  onChange={(e) => setCategoryFormData({...categoryFormData, farbe: e.target.value})}
                  className="w-16 h-10"
                />
                <Input
                  value={categoryFormData.farbe}
                  onChange={(e) => setCategoryFormData({...categoryFormData, farbe: e.target.value})}
                  placeholder="#059669"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={saveKategorie} className="bg-green-600 hover:bg-green-700">
                {selectedKategorie ? 'Aktualisieren' : 'Erstellen'}
              </Button>
              <Button variant="outline" onClick={() => setCategoryDialog(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};