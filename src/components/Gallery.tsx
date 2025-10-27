import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { Lock, Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category: string;
  is_public: boolean;
  created_at: string;
}

export const Gallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();

  const categories = [
    { value: 'all', label: 'Alle' },
    { value: 'wildlife', label: 'Wildtiere' },
    { value: 'hunting', label: 'Jagd' },
    { value: 'facilities', label: 'Einrichtungen' },
    { value: 'general', label: 'Allgemein' }
  ];

  useEffect(() => {
    fetchGallery();
  }, [user]);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_2025_10_23_06_04')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGallery(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGallery = gallery.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const visibleGallery = filteredGallery.filter(item => 
    item.is_public || user
  );

  if (loading) {
    return (
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade Bildergalerie...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bildergalerie</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie beeindruckende Aufnahmen aus unserem Jagdrevier - von majestätischen 
            Wildtieren bis hin zu unseren jagdlichen Einrichtungen.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleGallery.map((item) => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                </div>
                {!item.is_public && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    {categories.find(cat => cat.value === item.category)?.label || item.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleGallery.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {selectedCategory === 'all' 
                ? 'Derzeit sind keine Bilder verfügbar.' 
                : `Keine Bilder in der Kategorie "${categories.find(cat => cat.value === selectedCategory)?.label}" verfügbar.`
              }
            </p>
            {!user && (
              <p className="text-sm text-gray-400 mt-2">
                Melden Sie sich an, um weitere Bilder zu sehen.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};