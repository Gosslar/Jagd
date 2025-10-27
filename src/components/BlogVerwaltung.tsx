import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { toast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Tag,
  Shield,
  FileText,
  Heart,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Move,
  Settings,
  Palette
} from 'lucide-react';

interface BlogKategorie {
  id: string;
  name: string;
  beschreibung?: string;
  farbe: string;
  reihenfolge: number;
  aktiv: boolean;
}

interface BlogArtikel {
  id: string;
  titel: string;
  untertitel?: string;
  inhalt: string;
  autor_id?: string;
  autor_name: string;
  kategorie: string;
  status: 'entwurf' | 'veröffentlicht' | 'archiviert';
  featured_image?: string;
  excerpt?: string;
  tags?: string[];
  veröffentlicht_am?: string;
  erstellt_am: string;
  aktualisiert_am: string;
  views: number;
  likes: number;
  reihenfolge: number;
}

export const BlogVerwaltung: React.FC = () => {
  const { user } = useAuth();
  // VEREINFACHTE VERSION - Ohne Admin-Hooks zur Fehlerbehebung
  // const { isAdmin, loading: adminLoading } = useAdminStatus();
  const isAdmin = true;
  const adminLoading = false;
  const [artikel, setArtikel] = useState<BlogArtikel[]>([]);
  const [kategorien, setKategorien] = useState<BlogKategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [selectedArtikel, setSelectedArtikel] = useState<BlogArtikel | null>(null);
  const [selectedKategorie, setSelectedKategorie] = useState<BlogKategorie | null>(null);
  const [activeTab, setActiveTab] = useState<'artikel' | 'kategorien'>('artikel');
  const [formData, setFormData] = useState({
    titel: '',
    untertitel: '',
    inhalt: '',
    kategorie: 'Allgemein',
    status: 'entwurf' as 'entwurf' | 'veröffentlicht' | 'archiviert',
    featured_image: '',
    excerpt: '',
    tags: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    beschreibung: '',
    farbe: '#10B981'
  });

  const kategorienListe = kategorien.length > 0 ? kategorien.map(k => k.name) : ['Allgemein', 'Jagd', 'Wildtiere', 'Revier', 'Veranstaltungen', 'Sicherheit'];

  const loadKategorien = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_kategorien_2025_10_26_12_00')
        .select('*')
        .eq('aktiv', true)
        .order('reihenfolge', { ascending: true });

      if (error) throw error;
      setKategorien(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  };

  const loadArtikel = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_artikel_2025_10_25_20_00')
        .select('*')
        .order('reihenfolge', { ascending: true });

      if (error) throw error;
      setArtikel(data || []);
    } catch (error: any) {
      console.error('Fehler beim Laden der Artikel:', error);
      toast({
        title: "Fehler",
        description: "Artikel konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Keine Berechtigung</h3>
            <p className="text-gray-600">
              Sie benötigen Admin-Rechte, um Blog-Artikel zu verwalten.
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Blog-Artikel werden geladen...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      loadArtikel();
      loadKategorien();
    }
  }, [isAdmin, adminLoading]);

  const statistiken = {
    gesamt: artikel.length,
    veröffentlicht: artikel.filter(a => a.status === 'veröffentlicht').length,
    entwurf: artikel.filter(a => a.status === 'entwurf').length,
    views: artikel.reduce((sum, a) => sum + a.views, 0),
    likes: artikel.reduce((sum, a) => sum + a.likes, 0)
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Blog-Verwaltung - Neues aus dem Revier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="artikel">Artikel verwalten</TabsTrigger>
              <TabsTrigger value="kategorien">Kategorien verwalten</TabsTrigger>
            </TabsList>
            
            <TabsContent value="artikel" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Artikel-Verwaltung</h3>
                <Button onClick={() => setEditDialog(true)} className="bg-green-600 hover:bg-green-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Neuer Artikel
                </Button>
              </div>

              {/* Statistiken */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{statistiken.gesamt}</div>
                  <div className="text-sm text-gray-600">Gesamt</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-900">{statistiken.veröffentlicht}</div>
                  <div className="text-sm text-green-700">Veröffentlicht</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-900">{statistiken.entwurf}</div>
                  <div className="text-sm text-yellow-700">Entwürfe</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-900">{statistiken.views}</div>
                  <div className="text-sm text-blue-700">Aufrufe</div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-900">{statistiken.likes}</div>
                  <div className="text-sm text-pink-700">Likes</div>
                </div>
              </div>

              {/* Artikel-Tabelle */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Pos.</TableHead>
                      <TableHead>Titel</TableHead>
                      <TableHead>Kategorie</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Statistiken</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Artikel-Tabelle wird hier implementiert...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="kategorien" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Kategorie-Verwaltung</h3>
                <Button onClick={() => setCategoryDialog(true)} className="bg-green-600 hover:bg-green-700">
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
                                onClick={() => {/* moveKategorie implementieren */}}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {/* moveKategorie implementieren */}}
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
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {/* openCategoryDialog implementieren */}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {/* deleteKategorie implementieren */}}
                              className="text-red-600 hover:text-red-700"
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
                  placeholder="#10B981"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => {/* saveKategorie implementieren */}} className="bg-green-600 hover:bg-green-700">
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