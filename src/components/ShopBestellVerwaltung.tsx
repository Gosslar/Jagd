import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import jsPDF from 'jspdf';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Eye,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Euro,
  Download
} from 'lucide-react';

interface ShopBestellung {
  id: string;
  bestellnummer: string;
  kunde_id: string;
  kunde_name: string;
  kunde_email: string;
  kunde_telefon: string;
  abholung_datum: string;
  abholung_uhrzeit: string;
  abholung_notiz: string;
  gesamtpreis: number;
  status: 'neu' | 'bestaetigt' | 'bereit' | 'abgeholt' | 'storniert';
  zahlungsart: string;
  zahlungsstatus: 'offen' | 'bezahlt' | 'erstattet';
  admin_notiz: string;
  bearbeitet_von: string;
  bearbeitet_am: string;
  created_at: string;
}

interface BestellPosition {
  id: string;
  bestellung_id: string;
  produkt_id: string;
  produkt_name: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}

export const ShopBestellVerwaltung = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bestellungen, setBestellungen] = useState<ShopBestellung[]>([]);
  const [bestellpositionen, setBestellpositionen] = useState<{ [key: string]: BestellPosition[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedBestellung, setSelectedBestellung] = useState<ShopBestellung | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [adminNotiz, setAdminNotiz] = useState('');

  useEffect(() => {
    loadBestellungen();
  }, []);

  const loadBestellungen = async () => {
    try {
      setLoading(true);
      
      // Bestellungen laden
      const { data: bestellungenData, error: bestellungenError } = await supabase
        .from('shop_bestellungen_2025_10_27_14_00')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bestellungenError) throw bestellungenError;
      setBestellungen(bestellungenData || []);
      
      // Bestellpositionen für alle Bestellungen laden
      if (bestellungenData && bestellungenData.length > 0) {
        const bestellungIds = bestellungenData.map(b => b.id);
        const { data: positionenData, error: positionenError } = await supabase
          .from('shop_bestellpositionen_2025_10_27_14_00')
          .select('*')
          .in('bestellung_id', bestellungIds);
        
        if (positionenError) throw positionenError;
        
        // Positionen nach Bestellung gruppieren
        const groupedPositionen: { [key: string]: BestellPosition[] } = {};
        positionenData?.forEach(position => {
          if (!groupedPositionen[position.bestellung_id]) {
            groupedPositionen[position.bestellung_id] = [];
          }
          groupedPositionen[position.bestellung_id].push(position);
        });
        
        setBestellpositionen(groupedPositionen);
      }
      
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

  // Lieferschein als PDF generieren und herunterladen
  const generateLieferschein = (bestellung: ShopBestellung) => {
    const positionen = bestellpositionen[bestellung.id] || [];
    const datum = new Date().toLocaleDateString('de-DE');
    const abholdatum = new Date(bestellung.abholung_datum).toLocaleDateString('de-DE');
    
    // PDF erstellen
    const doc = new jsPDF();
    
    // Schriftarten und Farben definieren
    const primaryColor = [45, 80, 22]; // Jagdgrün #2d5016
    const textColor = [0, 0, 0];
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('Jagd Weetzen', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text('Am Denkmal 16 • 30952 Linderte', 105, 32, { align: 'center' });
    doc.text('Tel: +49 172 5265166 • info@jagd-weetzen.de', 105, 37, { align: 'center' });
    
    // Linie unter Header
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 42, 190, 42);
    
    // Dokumenttitel
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.text('LIEFERSCHEIN', 105, 55, { align: 'center' });
    
    // Lieferadresse (links)
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Lieferadresse', 20, 70);
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(bestellung.kunde_name, 20, 78);
    doc.text(`E-Mail: ${bestellung.kunde_email}`, 20, 84);
    if (bestellung.kunde_telefon) {
      doc.text(`Tel: ${bestellung.kunde_telefon}`, 20, 90);
    }
    
    // Lieferschein-Details (rechts)
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Lieferschein-Details', 120, 70);
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(`Lieferschein-Nr.: LS-${bestellung.bestellnummer}`, 120, 78);
    doc.text(`Bestellnummer: ${bestellung.bestellnummer}`, 120, 84);
    doc.text(`Datum: ${datum}`, 120, 90);
    doc.text(`Abholung: ${abholdatum} um ${bestellung.abholung_uhrzeit}`, 120, 96);
    doc.text(`Status: ${getStatusLabel(bestellung.status)}`, 120, 102);
    
    // Tabelle Header
    let yPos = 120;
    doc.setFillColor(...primaryColor);
    doc.rect(20, yPos, 170, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Pos.', 22, yPos + 5);
    doc.text('Artikel', 35, yPos + 5);
    doc.text('Menge', 120, yPos + 5);
    doc.text('Einzelpreis', 140, yPos + 5);
    doc.text('Gesamtpreis', 165, yPos + 5);
    
    // Tabelle Inhalt
    yPos += 10;
    doc.setTextColor(...textColor);
    
    positionen.forEach((position, index) => {
      // Zebrastreifen
      if (index % 2 === 0) {
        doc.setFillColor(249, 249, 249);
        doc.rect(20, yPos - 2, 170, 8, 'F');
      }
      
      doc.text((index + 1).toString(), 22, yPos + 3);
      doc.text(position.produkt_name, 35, yPos + 3);
      doc.text(position.menge.toString(), 120, yPos + 3);
      doc.text(`${position.einzelpreis.toFixed(2)}€`, 140, yPos + 3);
      doc.text(`${position.gesamtpreis.toFixed(2)}€`, 165, yPos + 3);
      
      yPos += 8;
    });
    
    // Gesamtsumme
    doc.setFillColor(232, 245, 232);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Gesamtsumme', 120, yPos + 5);
    doc.text(`${bestellung.gesamtpreis.toFixed(2)}€`, 165, yPos + 5);
    doc.setFont(undefined, 'normal');
    
    yPos += 15;
    
    // Kundennotiz
    if (bestellung.abholung_notiz) {
      doc.setFillColor(240, 248, 255);
      doc.rect(20, yPos, 170, 20, 'F');
      doc.setDrawColor(45, 80, 22);
      doc.setLineWidth(2);
      doc.line(20, yPos, 20, yPos + 20);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Kundennotiz:', 25, yPos + 8);
      doc.setFont(undefined, 'normal');
      
      // Text umbrechen
      const splitText = doc.splitTextToSize(bestellung.abholung_notiz, 160);
      doc.text(splitText, 25, yPos + 14);
      yPos += 25;
    }
    
    // Admin-Notiz
    if (bestellung.admin_notiz) {
      doc.setFillColor(255, 248, 220);
      doc.rect(20, yPos, 170, 20, 'F');
      doc.setDrawColor(255, 165, 0);
      doc.setLineWidth(2);
      doc.line(20, yPos, 20, yPos + 20);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Interne Notiz:', 25, yPos + 8);
      doc.setFont(undefined, 'normal');
      
      // Text umbrechen
      const splitText = doc.splitTextToSize(bestellung.admin_notiz, 160);
      doc.text(splitText, 25, yPos + 14);
      yPos += 25;
    }
    
    // Unterschriftenfelder
    yPos = Math.max(yPos + 20, 240);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 90, yPos);
    doc.line(120, yPos, 190, yPos);
    
    doc.setFontSize(9);
    doc.text('Datum, Unterschrift Kunde', 55, yPos + 8, { align: 'center' });
    doc.text('Datum, Unterschrift Jagd Weetzen', 155, yPos + 8, { align: 'center' });
    
    // Footer
    yPos += 25;
    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102);
    doc.text('Vielen Dank für Ihr Vertrauen in unsere Wildfleisch-Produkte!', 105, yPos, { align: 'center' });
    doc.text('Jagd Weetzen • Am Denkmal 16 • 30952 Linderte • Tel: +49 172 5265166', 105, yPos + 5, { align: 'center' });
    
    // PDF speichern
    const fileName = `Lieferschein_${bestellung.bestellnummer}_${datum.replace(/\./g, '-')}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "Lieferschein erstellt",
      description: `PDF-Lieferschein für Bestellung ${bestellung.bestellnummer} wurde heruntergeladen.`,
    });
  };

  const updateBestellungStatus = async (bestellungId: string, newStatus: string, notiz?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        bearbeitet_von: user?.id,
        bearbeitet_am: new Date().toISOString()
      };
      
      if (notiz) {
        updateData.admin_notiz = notiz;
      }
      
      const { error } = await supabase
        .from('shop_bestellungen_2025_10_27_14_00')
        .update(updateData)
        .eq('id', bestellungId);
      
      if (error) throw error;
      
      // Bei Bestätigung Lagerbestand reduzieren
      if (newStatus === 'bestaetigt') {
        const { error: stockError } = await supabase.rpc('approve_shop_order', {
          order_id: bestellungId,
          admin_user_id: user?.id,
          admin_note: notiz
        });
        
        if (stockError) {
          console.warn('Lagerbestand-Reduzierung fehlgeschlagen:', stockError);
        }
      }
      
      toast({
        title: "Status aktualisiert",
        description: "Bestellung wurde auf " + getStatusLabel(newStatus) + " gesetzt.",
      });
      
      loadBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateZahlungsstatus = async (bestellungId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('shop_bestellungen_2025_10_27_14_00')
        .update({
          zahlungsstatus: newStatus,
          bearbeitet_von: user?.id,
          bearbeitet_am: new Date().toISOString()
        })
        .eq('id', bestellungId);
      
      if (error) throw error;
      
      toast({
        title: "Zahlungsstatus aktualisiert",
        description: "Zahlung wurde auf " + getZahlungsstatusLabel(newStatus) + " gesetzt.",
      });
      
      loadBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'neu': 'Neu',
      'bestaetigt': 'Bestätigt',
      'bereit': 'Bereit zur Abholung',
      'abgeholt': 'Abgeholt',
      'storniert': 'Storniert'
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'neu': 'outline',
      'bestaetigt': 'default',
      'bereit': 'secondary',
      'abgeholt': 'default',
      'storniert': 'destructive'
    };
    return variants[status] || 'outline';
  };

  const getZahlungsstatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'offen': 'Offen',
      'bezahlt': 'Bezahlt',
      'erstattet': 'Erstattet'
    };
    return labels[status] || status;
  };

  const getZahlungsstatusVariant = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'offen': 'outline',
      'bezahlt': 'default',
      'erstattet': 'secondary'
    };
    return variants[status] || 'outline';
  };

  const openDetailDialog = (bestellung: ShopBestellung) => {
    setSelectedBestellung(bestellung);
    setAdminNotiz(bestellung.admin_notiz || '');
    setDetailDialog(true);
  };

  const saveAdminNotiz = async () => {
    if (!selectedBestellung) return;
    
    try {
      const { error } = await supabase
        .from('shop_bestellungen_2025_10_27_14_00')
        .update({
          admin_notiz: adminNotiz,
          bearbeitet_von: user?.id,
          bearbeitet_am: new Date().toISOString()
        })
        .eq('id', selectedBestellung.id);
      
      if (error) throw error;
      
      toast({
        title: "Notiz gespeichert",
        description: "Die Admin-Notiz wurde erfolgreich gespeichert.",
      });
      
      loadBestellungen();
      setDetailDialog(false);
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Lade Bestellungen...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Shop-Bestellverwaltung ({bestellungen.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bestellungen.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Noch keine Bestellungen vorhanden.
              </p>
            ) : (
              bestellungen.map((bestellung) => {
                const positionen = bestellpositionen[bestellung.id] || [];
                
                return (
                  <Card key={bestellung.id} className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {bestellung.bestellnummer}
                          </h3>
                          <Badge variant={getStatusVariant(bestellung.status)}>
                            {getStatusLabel(bestellung.status)}
                          </Badge>
                          <Badge variant={getZahlungsstatusVariant(bestellung.zahlungsstatus)}>
                            <Euro className="h-3 w-3 mr-1" />
                            {getZahlungsstatusLabel(bestellung.zahlungsstatus)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{bestellung.kunde_name}</div>
                              <div className="text-gray-600">{bestellung.kunde_email}</div>
                            </div>
                          </div>
                          
                          {bestellung.kunde_telefon && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <div>{bestellung.kunde_telefon}</div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <div>Abholung: {new Date(bestellung.abholung_datum).toLocaleDateString('de-DE')}</div>
                              <div className="text-gray-600">{bestellung.abholung_uhrzeit}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-bold text-lg">
                                {bestellung.gesamtpreis.toFixed(2)}€
                              </div>
                              <div className="text-gray-600">{bestellung.zahlungsart}</div>
                            </div>
                          </div>
                        </div>
                        
                        {positionen.length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <h4 className="font-medium mb-2">Bestellte Artikel:</h4>
                            <div className="space-y-1">
                              {positionen.map((position) => (
                                <div key={position.id} className="flex justify-between text-sm">
                                  <span>{position.menge}x {position.produkt_name}</span>
                                  <span>{position.gesamtpreis.toFixed(2)}€</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {bestellung.abholung_notiz && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>Kundennotiz:</strong> {bestellung.abholung_notiz}
                          </div>
                        )}
                        
                        {bestellung.admin_notiz && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                            <strong>Admin-Notiz:</strong> {bestellung.admin_notiz}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailDialog(bestellung)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                        
                        {bestellung.status === 'neu' && (
                          <Button
                            size="sm"
                            onClick={() => updateBestellungStatus(bestellung.id, 'bestaetigt')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Bestätigen
                          </Button>
                        )}
                        
                        {/* Lieferschein-Download für freigegebene Bestellungen */}
                        {(bestellung.status === 'bestaetigt' || bestellung.status === 'bereit' || bestellung.status === 'abgeholt') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateLieferschein(bestellung)}
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Lieferschein
                          </Button>
                        )}
                        
                        {bestellung.status === 'bestaetigt' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateBestellungStatus(bestellung.id, 'bereit')}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Bereit
                          </Button>
                        )}
                        
                        {bestellung.status === 'bereit' && (
                          <Button
                            size="sm"
                            onClick={() => updateBestellungStatus(bestellung.id, 'abgeholt')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Abgeholt
                          </Button>
                        )}
                        
                        {bestellung.zahlungsstatus === 'offen' && bestellung.status !== 'storniert' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateZahlungsstatus(bestellung.id, 'bezahlt')}
                          >
                            <Euro className="h-4 w-4 mr-1" />
                            Als bezahlt markieren
                          </Button>
                        )}
                        
                        {bestellung.status !== 'abgeholt' && bestellung.status !== 'storniert' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateBestellungStatus(bestellung.id, 'storniert')}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Stornieren
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Bestelldetails - {selectedBestellung?.bestellnummer}
            </DialogTitle>
          </DialogHeader>
          {selectedBestellung && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Kundendaten</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedBestellung.kunde_name}</div>
                    <div><strong>E-Mail:</strong> {selectedBestellung.kunde_email}</div>
                    {selectedBestellung.kunde_telefon && (
                      <div><strong>Telefon:</strong> {selectedBestellung.kunde_telefon}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Abholung</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Datum:</strong> {new Date(selectedBestellung.abholung_datum).toLocaleDateString('de-DE')}</div>
                    <div><strong>Uhrzeit:</strong> {selectedBestellung.abholung_uhrzeit}</div>
                    <div><strong>Status:</strong> {getStatusLabel(selectedBestellung.status)}</div>
                    <div><strong>Zahlung:</strong> {getZahlungsstatusLabel(selectedBestellung.zahlungsstatus)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Bestellte Artikel</h4>
                <div className="space-y-2">
                  {(bestellpositionen[selectedBestellung.id] || []).map((position) => (
                    <div key={position.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{position.produkt_name}</div>
                        <div className="text-sm text-gray-600">
                          {position.menge} Stück à {position.einzelpreis.toFixed(2)}€
                        </div>
                      </div>
                      <div className="font-bold">
                        {position.gesamtpreis.toFixed(2)}€
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-2 bg-green-100 rounded font-bold">
                    <span>Gesamtsumme:</span>
                    <span>{selectedBestellung.gesamtpreis.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              
              {selectedBestellung.abholung_notiz && (
                <div>
                  <h4 className="font-semibold mb-2">Kundennotiz</h4>
                  <div className="p-3 bg-blue-50 rounded text-sm">
                    {selectedBestellung.abholung_notiz}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Admin-Notiz</h4>
                <Textarea
                  value={adminNotiz}
                  onChange={(e) => setAdminNotiz(e.target.value)}
                  placeholder="Interne Notizen zur Bestellung..."
                  rows={3}
                />
                <Button onClick={saveAdminNotiz} className="mt-2">
                  <Edit className="h-4 w-4 mr-2" />
                  Notiz speichern
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};