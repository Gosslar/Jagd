import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';

interface BlogArtikel {
  id: string;
  titel: string;
  inhalt: string;
  kategorie: string;
  status: string;
  reihenfolge: number;
  veröffentlicht_am: string;
}

export const BlogVerwaltungSimple: React.FC = () => {
  const { user } = useAuth();
  const [artikel, setArtikel] = useState<BlogArtikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({
    titel: '',
    inhalt: '',
    kategorie: 'Allgemein'
  });

  const loadArtikel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_artikel_2025_10_25_20_00')
        .select('*')
        .order('reihenfolge', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden der Artikel:', error);
        return;
      }
      
      setArtikel(data || []);
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const createArtikel = async () => {
    if (!newArticle.titel.trim()) {
      toast({
        title: "Fehler",
        description: "Titel ist erforderlich",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_artikel_2025_10_25_20_00')
        .insert({
          titel: newArticle.titel,
          inhalt: newArticle.inhalt,
          kategorie: newArticle.kategorie,
          status: 'veröffentlicht',
          autor_id: user?.id
        });

      if (error) throw error;

      toast({
        title: "Artikel erstellt",
        description: "Der Artikel wurde erfolgreich erstellt",
      });

      setNewArticle({ titel: '', inhalt: '', kategorie: 'Allgemein' });
      await loadArtikel();
    } catch (error: any) {
      console.error('Fehler beim Erstellen:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteArtikel = async (id: string) => {
    if (!confirm('Artikel wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('blog_artikel_2025_10_25_20_00')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Artikel gelöscht",
        description: "Der Artikel wurde erfolgreich gelöscht",
      });

      await loadArtikel();
    } catch (error: any) {
      console.error('Fehler beim Löschen:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadArtikel();
    }
  }, [user]);

  if (!user) {
    return (
      <Card className="max-w-6xl mx-auto m-6">
        <CardContent className="text-center py-8">
          <p>Bitte melden Sie sich an, um die Blog-Verwaltung zu nutzen.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-6xl mx-auto m-6">
        <CardContent className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
          <p>Lade Artikel...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto m-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Blog-Verwaltung (Vereinfacht)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Neuer Artikel */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold">Neuen Artikel erstellen</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="titel">Titel *</Label>
              <Input
                id="titel"
                value={newArticle.titel}
                onChange={(e) => setNewArticle({...newArticle, titel: e.target.value})}
                placeholder="Artikel-Titel"
              />
            </div>
            <div>
              <Label htmlFor="kategorie">Kategorie</Label>
              <Input
                id="kategorie"
                value={newArticle.kategorie}
                onChange={(e) => setNewArticle({...newArticle, kategorie: e.target.value})}
                placeholder="Kategorie"
              />
            </div>
            <div>
              <Label htmlFor="inhalt">Inhalt</Label>
              <Textarea
                id="inhalt"
                value={newArticle.inhalt}
                onChange={(e) => setNewArticle({...newArticle, inhalt: e.target.value})}
                placeholder="Artikel-Inhalt"
                rows={4}
              />
            </div>
            <Button onClick={createArtikel} className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Artikel erstellen
            </Button>
          </div>
        </div>

        {/* Artikel-Liste */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vorhandene Artikel ({artikel.length})</h3>
          {artikel.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Keine Artikel vorhanden</p>
          ) : (
            <div className="grid gap-4">
              {artikel.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{article.titel}</h4>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{article.kategorie}</Badge>
                          <Badge variant="outline">Pos. {article.reihenfolge}</Badge>
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {article.inhalt.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteArtikel(article.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};