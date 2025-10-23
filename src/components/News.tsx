import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Calendar, User, Lock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  is_public: boolean;
  created_at: string;
}

export const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNews();
  }, [user]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_2025_10_23_06_04')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="news" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade Neuigkeiten...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Aktuelles aus dem Revier</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bleiben Sie auf dem Laufenden über wichtige Ereignisse, Jagdtermine und 
            Neuigkeiten aus unserem Jagdrevier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url && (
                <div className="aspect-video relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  {!item.is_public && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Mitglieder
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.created_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">
                  {item.excerpt || item.content.substring(0, 150) + '...'}
                </p>
                {!item.is_public && !user && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Melden Sie sich an, um den vollständigen Artikel zu lesen.
                    </p>
                  </div>
                )}
                {(item.is_public || user) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{item.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Derzeit sind keine Neuigkeiten verfügbar.</p>
          </div>
        )}
      </div>
    </section>
  );
};