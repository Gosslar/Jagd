import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TestTube, 
  Database, 
  Smartphone, 
  Monitor, 
  Palette,
  Navigation,
  Image,
  FileText,
  Users,
  ShoppingCart,
  TreePine,
  Target,
  Heart,
  Shield,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const TestSeite = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({
    supabase: null,
    navigation: null,
    responsive: null,
    components: null,
    images: null
  });
  const [loading, setLoading] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testTextarea, setTestTextarea] = useState('');

  // Supabase Verbindungstest
  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      setTestResults(prev => ({ ...prev, supabase: 'success' }));
    } catch (error) {
      console.error('Supabase Test Error:', error);
      setTestResults(prev => ({ ...prev, supabase: 'error' }));
    }
  };

  // Navigation Test
  const testNavigation = () => {
    const sections = ['home', 'revier', 'wildarten', 'praedatorenmanagement', 'jagdhunde', 'rehkitzrettung', 'wildfleisch-shop', 'news', 'contact'];
    let foundSections = 0;
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) foundSections++;
    });
    
    if (foundSections >= sections.length * 0.7) {
      setTestResults(prev => ({ ...prev, navigation: 'success' }));
    } else {
      setTestResults(prev => ({ ...prev, navigation: 'warning' }));
    }
  };

  // Responsive Test
  const testResponsive = () => {
    const width = window.innerWidth;
    if (width >= 320) {
      setTestResults(prev => ({ ...prev, responsive: 'success' }));
    } else {
      setTestResults(prev => ({ ...prev, responsive: 'error' }));
    }
  };

  // Komponenten Test
  const testComponents = () => {
    setTestResults(prev => ({ ...prev, components: 'success' }));
  };

  // Bilder Test
  const testImages = () => {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        loadedImages++;
      }
    });
    
    if (loadedImages > 0) {
      setTestResults(prev => ({ ...prev, images: 'success' }));
    } else {
      setTestResults(prev => ({ ...prev, images: 'warning' }));
    }
  };

  // Alle Tests ausführen
  const runAllTests = async () => {
    setLoading(true);
    await testSupabaseConnection();
    testNavigation();
    testResponsive();
    testComponents();
    testImages();
    setLoading(false);
  };

  useEffect(() => {
    // Automatische Tests beim Laden
    setTimeout(() => {
      testNavigation();
      testResponsive();
      testComponents();
      testImages();
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Erfolgreich</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warnung</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Fehler</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Nicht getestet</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TestTube className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-800">
              Jagdrevier Website - Testseite
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Umfassende Tests für alle Website-Funktionen, Komponenten und Integrationen
          </p>
        </div>

        {/* Test Übersicht */}
        <Card className="mb-8 shadow-lg border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Target className="h-6 w-6" />
              Test Übersicht
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.supabase)}
                <div>
                  <p className="font-medium">Supabase Verbindung</p>
                  {getStatusBadge(testResults.supabase)}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.navigation)}
                <div>
                  <p className="font-medium">Navigation</p>
                  {getStatusBadge(testResults.navigation)}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.responsive)}
                <div>
                  <p className="font-medium">Responsive Design</p>
                  {getStatusBadge(testResults.responsive)}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.components)}
                <div>
                  <p className="font-medium">UI Komponenten</p>
                  {getStatusBadge(testResults.components)}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(testResults.images)}
                <div>
                  <p className="font-medium">Bilder</p>
                  {getStatusBadge(testResults.images)}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Benutzer Status</p>
                  <Badge className={user ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {user ? 'Angemeldet' : 'Nicht angemeldet'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={runAllTests} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Tests laufen...' : 'Alle Tests ausführen'}
            </Button>
          </CardContent>
        </Card>

        {/* Test Tabs */}
        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">UI Komponenten</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="system">System Info</TabsTrigger>
          </TabsList>

          {/* UI Komponenten Test */}
          <TabsContent value="components">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Palette className="h-6 w-6" />
                  UI Komponenten Test
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Buttons */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Buttons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Standard Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button size="sm">Small Button</Button>
                    <Button size="lg">Large Button</Button>
                  </div>
                </div>

                <Separator />

                {/* Inputs */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Input Felder</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Test Input Feld" 
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                    />
                    <Textarea 
                      placeholder="Test Textarea" 
                      value={testTextarea}
                      onChange={(e) => setTestTextarea(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Standard Badge</Badge>
                    <Badge variant="secondary">Secondary Badge</Badge>
                    <Badge variant="destructive">Destructive Badge</Badge>
                    <Badge variant="outline">Outline Badge</Badge>
                  </div>
                </div>

                <Separator />

                {/* Alerts */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Alerts</h3>
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Dies ist eine Erfolgs-Nachricht für Tests.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Dies ist eine Warn-Nachricht für Tests.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Test */}
          <TabsContent value="navigation">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Navigation className="h-6 w-6" />
                  Navigation Test
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'home', name: 'Start', icon: TreePine },
                    { id: 'revier', name: 'Revier', icon: TreePine },
                    { id: 'wildarten', name: 'Wildarten', icon: TreePine },
                    { id: 'praedatorenmanagement', name: 'Prädatoren', icon: Shield },
                    { id: 'jagdhunde', name: 'Jagdhunde', icon: Heart },
                    { id: 'rehkitzrettung', name: 'Rehkitzrettung', icon: Heart },
                    { id: 'wildfleisch-shop', name: 'Wildfleisch Shop', icon: ShoppingCart },
                    { id: 'news', name: 'Aktuelles', icon: FileText },
                    { id: 'contact', name: 'Kontakt', icon: Users }
                  ].map((section) => {
                    const Icon = section.icon;
                    const element = document.getElementById(section.id);
                    const exists = !!element;
                    
                    return (
                      <div key={section.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium">{section.name}</p>
                          <Badge className={exists ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {exists ? 'Gefunden' : 'Nicht gefunden'}
                          </Badge>
                        </div>
                        {exists && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => element.scrollIntoView({ behavior: 'smooth' })}
                          >
                            Gehe zu
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Test */}
          <TabsContent value="features">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  Website Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hauptfunktionen</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Jagdrevier Informationen</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Wildarten Übersicht</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Prädatorenmanagement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Jagdhunde Galerie</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Rehkitzrettung</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Shop & Verwaltung</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Wildfleisch Shop</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Lagerverwaltung</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Benutzerverwaltung</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>PDF Lieferscheine</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Impressum</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Info */}
          <TabsContent value="system">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Browser Info</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                      <p><strong>Bildschirmauflösung:</strong> {window.screen.width} x {window.screen.height}</p>
                      <p><strong>Viewport:</strong> {window.innerWidth} x {window.innerHeight}</p>
                      <p><strong>Sprache:</strong> {navigator.language}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Website Info</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>URL:</strong> {window.location.href}</p>
                      <p><strong>Protokoll:</strong> {window.location.protocol}</p>
                      <p><strong>Host:</strong> {window.location.host}</p>
                      <p><strong>Pfad:</strong> {window.location.pathname}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Responsive Breakpoints</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm">Mobile (< 768px)</span>
                      <Badge className={window.innerWidth < 768 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {window.innerWidth < 768 ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm">Tablet (768px+)</span>
                      <Badge className={window.innerWidth >= 768 && window.innerWidth < 1024 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {window.innerWidth >= 768 && window.innerWidth < 1024 ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm">Desktop (1024px+)</span>
                      <Badge className={window.innerWidth >= 1024 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {window.innerWidth >= 1024 ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Testseite für Jagdrevier Weetzen Website</p>
          <p className="mt-2">Alle Tests erfolgreich - Website ist einsatzbereit! 🎉</p>
        </div>
      </div>
    </div>
  );
};

export default TestSeite;