import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Package, Plus, Minus, RefreshCw, PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';

interface LagerItem {
  id: string;
  produkt_name: string;
  kategorie: string;
  preis: number;
  einheit: string;
  lagerbestand: number;
  mindestbestand: number;
  verfügbar: boolean;
}

export const LagerVerwaltungSimple: React.FC = () => {
  const { user } = useAuth();
  const [lagerItems, setLagerItems] = useState<LagerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [editData, setEditData] = useState<LagerItem | null>(null);
  const [newProduct, setNewProduct] = useState({
    produkt_name: '',
    kategorie: 'Rehwild',
    preis: '',
    einheit: '',
    lagerbestand: '',
    mindestbestand: ''
  });

  const fetchLagerbestand = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .select('*')
        .order('kategorie', { ascending: true })
        .order('produkt_name', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden der Lagerbestände:', error);
        return;
      }

      setLagerItems(data || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLagerbestand = async (id: string, newBestand: number) => {
    if (newBestand < 0) return;

    try {
      setUpdating(id);
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .update({ lagerbestand: newBestand })
        .eq('id', id);

      if (error) throw error;

      await fetchLagerbestand();
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const updatePrice = async (id: string, newPrice: number) => {
    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .update({ preis: newPrice })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Preis aktualisiert",
        description: "Der Preis wurde erfolgreich geändert",
      });

      await fetchLagerbestand();
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Preises:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startEditPrice = (item: LagerItem) => {
    setEditingPrice(item.id);
    setTempPrice(item.preis.toString());
  };

  const savePrice = async (id: string) => {
    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast({
        title: "Fehler",
        description: "Ungültiger Preis",
        variant: "destructive",
      });
      return;
    }
    await updatePrice(id, newPrice);
    setEditingPrice(null);
    setTempPrice('');
  };

  const cancelEditPrice = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const startEditProduct = (item: LagerItem) => {
    setEditingProduct(item.id);
    setEditData({ ...item });
  };

  const saveProduct = async () => {
    if (!editData) return;

    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .update({
          produkt_name: editData.produkt_name,
          kategorie: editData.kategorie,
          preis: editData.preis,
          einheit: editData.einheit,
          lagerbestand: editData.lagerbestand,
          mindestbestand: editData.mindestbestand
        })
        .eq('id', editData.id);

      if (error) throw error;

      toast({
        title: "Produkt aktualisiert",
        description: "Das Produkt wurde erfolgreich geändert",
      });

      setEditingProduct(null);
      setEditData(null);
      await fetchLagerbestand();
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setEditData(null);
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Produkt "${name}" wirklich löschen?`)) return;

    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Produkt gelöscht",
        description: "Das Produkt wurde erfolgreich gelöscht",
      });

      await fetchLagerbestand();
    } catch (error: any) {
      console.error('Fehler beim Löschen:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createProduct = async () => {
    if (!newProduct.produkt_name.trim() || !newProduct.preis) {
      toast({
        title: "Fehler",
        description: "Name und Preis sind erforderlich",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wildfleisch_lager_2025_10_24_14_00')
        .insert({
          produkt_name: newProduct.produkt_name,
          kategorie: newProduct.kategorie,
          preis: parseFloat(newProduct.preis),
          einheit: newProduct.einheit,
          lagerbestand: parseInt(newProduct.lagerbestand) || 0,
          mindestbestand: parseInt(newProduct.mindestbestand) || 0
        });

      if (error) throw error;

      toast({
        title: "Produkt erstellt",
        description: "Das Produkt wurde erfolgreich erstellt",
      });

      setNewProduct({
        produkt_name: '',
        kategorie: 'Rehwild',
        preis: '',
        einheit: '',
        lagerbestand: '',
        mindestbestand: ''
      });

      await fetchLagerbestand();
    } catch (error: any) {
      console.error('Fehler beim Erstellen:', error);
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
    if (user) {
      fetchLagerbestand();
    }
  }, [user]);

  if (!user) {
    return (
      <Card className="max-w-6xl mx-auto m-6">
        <CardContent className="text-center py-8">
          <p>Bitte melden Sie sich an, um die Lagerverwaltung zu nutzen.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-6xl mx-auto m-6">
        <CardContent className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
          <p>Lade Lagerbestände...</p>
        </CardContent>
      </Card>
    );
  }

  const kategorien = [...new Set(lagerItems.map(item => item.kategorie))];

  return (
    <Card className="max-w-6xl mx-auto m-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Lagerverwaltung (Vereinfacht)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Neues Produkt */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Neues Produkt erstellen</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="produkt_name">Produktname *</Label>
              <Input
                id="produkt_name"
                value={newProduct.produkt_name}
                onChange={(e) => setNewProduct({...newProduct, produkt_name: e.target.value})}
                placeholder="Produktname"
              />
            </div>
            <div>
              <Label htmlFor="kategorie">Kategorie</Label>
              <Input
                id="kategorie"
                value={newProduct.kategorie}
                onChange={(e) => setNewProduct({...newProduct, kategorie: e.target.value})}
                placeholder="Kategorie"
              />
            </div>
            <div>
              <Label htmlFor="preis">Preis (€) *</Label>
              <Input
                id="preis"
                type="number"
                step="0.01"
                value={newProduct.preis}
                onChange={(e) => setNewProduct({...newProduct, preis: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="einheit">Einheit</Label>
              <Input
                id="einheit"
                value={newProduct.einheit}
                onChange={(e) => setNewProduct({...newProduct, einheit: e.target.value})}
                placeholder="z.B. je Kg, je Stück"
              />
            </div>
            <div>
              <Label htmlFor="lagerbestand">Lagerbestand</Label>
              <Input
                id="lagerbestand"
                type="number"
                value={newProduct.lagerbestand}
                onChange={(e) => setNewProduct({...newProduct, lagerbestand: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="mindestbestand">Mindestbestand</Label>
              <Input
                id="mindestbestand"
                type="number"
                value={newProduct.mindestbestand}
                onChange={(e) => setNewProduct({...newProduct, mindestbestand: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          <Button onClick={createProduct} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Produkt erstellen
          </Button>
        </div>

        {/* Produkte nach Kategorien */}
        <div className="space-y-6">
          {kategorien.map(kategorie => (
            <Card key={kategorie}>
              <CardHeader>
                <CardTitle className="text-lg">{kategorie}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lagerItems
                    .filter(item => item.kategorie === kategorie)
                    .map(item => {
                      const status = getBestandsStatus(item);
                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            {editingProduct === item.id && editData ? (
                              // Bearbeitungsmodus
                              <div className="space-y-2">
                                <Input
                                  value={editData.produkt_name}
                                  onChange={(e) => setEditData({...editData, produkt_name: e.target.value})}
                                  className="font-semibold"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    value={editData.kategorie}
                                    onChange={(e) => setEditData({...editData, kategorie: e.target.value})}
                                    placeholder="Kategorie"
                                  />
                                  <Input
                                    value={editData.einheit}
                                    onChange={(e) => setEditData({...editData, einheit: e.target.value})}
                                    placeholder="Einheit"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editData.preis}
                                    onChange={(e) => setEditData({...editData, preis: parseFloat(e.target.value) || 0})}
                                    placeholder="Preis"
                                  />
                                  <Input
                                    type="number"
                                    value={editData.lagerbestand}
                                    onChange={(e) => setEditData({...editData, lagerbestand: parseInt(e.target.value) || 0})}
                                    placeholder="Lagerbestand"
                                  />
                                  <Input
                                    type="number"
                                    value={editData.mindestbestand}
                                    onChange={(e) => setEditData({...editData, mindestbestand: parseInt(e.target.value) || 0})}
                                    placeholder="Mindestbestand"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveProduct} className="bg-green-600 hover:bg-green-700">
                                    <Save className="h-3 w-3 mr-1" />
                                    Speichern
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEditProduct}>
                                    <X className="h-3 w-3 mr-1" />
                                    Abbrechen
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Anzeigemodus
                              <div>
                                <h4 className="font-semibold">{item.produkt_name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {editingPrice === item.id ? (
                                    <div className="flex items-center gap-1">
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={tempPrice}
                                        onChange={(e) => setTempPrice(e.target.value)}
                                        className="w-20 h-6 text-sm"
                                      />
                                      <span className="text-sm">€ {item.einheit}</span>
                                      <Button size="sm" onClick={() => savePrice(item.id)} className="h-6 px-2">
                                        <Save className="h-3 w-3" />
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={cancelEditPrice} className="h-6 px-2">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startEditPrice(item)}
                                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                                    >
                                      {item.preis.toFixed(2)}€ {item.einheit}
                                      <Edit className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                                <Badge className={status.color}>
                                  {status.text}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {editingProduct === item.id ? null : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateLagerbestand(item.id, item.lagerbestand - 1)}
                                  disabled={updating === item.id || item.lagerbestand === 0}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-mono">
                                  {item.lagerbestand}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateLagerbestand(item.id, item.lagerbestand + 1)}
                                  disabled={updating === item.id}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditProduct(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteProduct(item.id, item.produkt_name)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};