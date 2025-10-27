import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { Calendar, User, Eye, Heart, Tag, Clock } from 'lucide-react';

interface BlogArtikel {
  id: string;
  titel: string;
  untertitel?: string;
  inhalt: string;
  autor_name: string;
  kategorie: string;
  status: string;
  featured_image?: string;
  excerpt?: string;
  tags?: string[];
  veröffentlicht_am?: string;
  erstellt_am: string;
  views: number;
  likes: number;
}

export const News: React.FC = () => {
  const [artikel, setArtikel] = useState<BlogArtikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArtikel, setExpandedArtikel] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_artikel_2025_10_25_20_00')
        .select('*')
        .eq('status', 'veröffentlicht')
        .order('reihenfolge', { ascending: true })
        .limit(6);

      if (error) throw error;
      setArtikel(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (artikelId: string) => {
    try {
      await supabase.rpc('increment_article_views', {
        artikel_id: artikelId
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const toggleLike = async (artikelId: string) => {
    try {
      const { data, error } = await supabase.rpc('toggle_article_like', {
        artikel_id: artikelId
      });

      if (error) throw error;

      // Update local state
      setArtikel(prev => prev.map(artikel => 
        artikel.id === artikelId 
          ? { ...artikel, likes: data.likes }
          : artikel
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleExpanded = (artikelId: string) => {
    if (expandedArtikel === artikelId) {
      setExpandedArtikel(null);
    } else {
      setExpandedArtikel(artikelId);
      incrementViews(artikelId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getKategorieColor = (kategorie: string) => {
    switch (kategorie) {
      case 'Jagd': return 'bg-green-100 text-green-800';
      case 'Wildtiere': return 'bg-blue-100 text-blue-800';
      case 'Revier': return 'bg-yellow-100 text-yellow-800';
      case 'Veranstaltungen': return 'bg-purple-100 text-purple-800';
      case 'Sicherheit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section id="news" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neues aus dem Revier</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Neues aus dem Revier</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Aktuelle Nachrichten, Ereignisse und Entwicklungen aus unserem Jagdrevier
          </p>
        </div>

        {artikel.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Noch keine Artikel</h3>
              <p>Bald gibt es hier Neuigkeiten aus dem Revier zu lesen.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artikel.map((artikel) => (
              <Card key={artikel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {artikel.featured_image && (
                  <div className="aspect-video relative">
                    <img 
                      src={artikel.featured_image} 
                      alt={artikel.titel}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getKategorieColor(artikel.kategorie)}>
                      {artikel.kategorie}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="h-3 w-3" />
                      {artikel.views}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {artikel.titel}
                  </CardTitle>
                  {artikel.untertitel && (
                    <p className="text-sm text-gray-600 font-medium">
                      {artikel.untertitel}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {expandedArtikel === artikel.id 
                        ? artikel.inhalt
                        : artikel.excerpt || artikel.inhalt.substring(0, 150) + '...'
                      }
                    </p>

                    {artikel.tags && artikel.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {artikel.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {artikel.autor_name}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {formatDate(artikel.veröffentlicht_am || artikel.erstellt_am)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleLike(artikel.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          {artikel.likes}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExpanded(artikel.id)}
                        >
                          {expandedArtikel === artikel.id ? 'Weniger' : 'Mehr lesen'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {artikel.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Weitere Artikel folgen in Kürze. Bleiben Sie auf dem Laufenden!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};