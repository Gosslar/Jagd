import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
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
  Download,
  XCircle,
  Filter,
  RefreshCw,
  ShoppingCart,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface ShopBestellung {
  id: string;
  bestellnummer: string;
  kunde_id: string;
  kunde_name: string;
  kunde_email: string;
  kunde_telefon: string;
  kunde_adresse: string;
  bestelldatum: string;
  gesamtpreis: number;
  status: string;
  zahlungsstatus: string;
  lieferstatus: string;
  notizen?: string;
  bezahlt: boolean;
  geliefert: boolean;
  lieferdatum?: string;
  created_at: string;
  updated_at: string;
}

interface BestellPosition {
  id: string;
  bestellung_id: string;
  produkt_name: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}

export const ShopBestellVerwaltung: React.FC = () => {
  const [bestellungen, setBestellungen] = useState<ShopBestellung[]>([]);
  const [positionen, setPositionen] = useState<{ [key: string]: BestellPosition[] }>({});
  const [selectedBestellung, setSelectedBestellung] = useState<ShopBestellung | null>(null);
  const [loading, setLoading] = useState(true);
  const [notizen, setNotizen] = useState('');
  const [activeTab, setActiveTab] = useState('alle');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Auto-refresh alle 30 Sekunden für neue Bestellungen
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh: Checking for new orders...');
      loadBestellungen();
      setLastRefresh(new Date());
    }, 30000); // 30 Sekunden
    
    return () => clearInterval(interval);
  }, []);

  const loadBestellungen = async () => {
    try {
      setLoading(true);
      console.log('🔄 STARTING LOAD - Orders and Positions...');
      console.log('🕰️ Current time:', new Date().toISOString());
      
      // Lade Bestellungen aus der einfachen Tabelle (mit Cache-Bypass und Fehlerbehandlung)
      console.log('💾 Querying table: simple_bestellungen_2025_11_06_21_00');
      const { data: bestellungenData, error: bestellungenError } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('💾 Query result:', { data: bestellungenData, error: bestellungenError });
      
      console.log('📦 Raw orders from database:', bestellungenData?.length || 0, 'orders');
      console.log('📦 Latest order timestamp:', bestellungenData?.[0]?.created_at);

      if (bestellungenError) throw bestellungenError;

      // Konvertiere zu ShopBestellung Format
      const convertedBestellungen: ShopBestellung[] = (bestellungenData || []).map(b => ({
        id: b.id,
        bestellnummer: `#${b.id.slice(-8)}`,
        kunde_id: b.id,
        kunde_name: b.name,
        kunde_email: b.email,
        kunde_telefon: b.telefon || '',
        kunde_adresse: b.adresse || '',
        bestelldatum: b.created_at,
        gesamtpreis: b.gesamtpreis,
        status: b.status || 'neu',
        zahlungsstatus: 'offen',
        lieferstatus: 'vorbereitung',
        notizen: b.nachricht || '',
        bezahlt: b.bezahlt || false,
        geliefert: b.geliefert || false,
        lieferdatum: b.lieferdatum || null,
        created_at: b.created_at,
        updated_at: b.updated_at || b.created_at
      }));

      setBestellungen(convertedBestellungen);

      // Lade Bestellpositionen
      console.log('Loading positions from database...');
      const { data: positionenData, error: positionenError } = await supabase
        .from('simple_bestellpositionen_2025_11_06_21_00')
        .select('*');
      
      console.log('🛒 POSITIONS LOADED:', positionenData?.length || 0, 'positions');
      console.log('🛒 POSITIONS DATA:', positionenData);
      console.log('🛒 POSITIONS ERROR:', positionenError);
      
      // Zeige jede Position einzeln
      positionenData?.forEach((pos, index) => {
        console.log(`🥩 POSITION ${index + 1}:`, {
          id: pos.id,
          bestellung_id: pos.bestellung_id,
          produkt_name: pos.produkt_name,
          menge: pos.menge
        });
      });

      if (positionenError) throw positionenError;

      // Gruppiere Positionen nach Bestellung
      const positionenMap: { [key: string]: BestellPosition[] } = {};
      positionenData?.forEach(position => {
        console.log('Processing position:', position);
        if (!positionenMap[position.bestellung_id]) {
          positionenMap[position.bestellung_id] = [];
        }
        positionenMap[position.bestellung_id].push({
          id: position.id,
          bestellung_id: position.bestellung_id,
          produkt_name: position.produkt_name,
          menge: position.menge,
          einzelpreis: position.einzelpreis,
          gesamtpreis: position.gesamtpreis
        });
      });
      console.log('Final positions map:', positionenMap);
      setPositionen(positionenMap);

    } catch (error: any) {
      console.error('Fehler beim Laden der Bestellungen:', error);
      toast({
        title: "Fehler",
        description: "Bestellungen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBestellungStatus = async (id: string, newStatus: string) => {
    try {
      console.log('Updating order status:', { id, newStatus });
      
      // Wenn Bestellung bestätigt wird, reduziere Lagerbestände
      if (newStatus === 'bestätigt') {
        console.log('📦 Bestellung bestätigt - reduziere Lagerbestände...');
        
        // Lade Bestellpositionen für diese Bestellung
        const { data: bestellPositionen, error: positionenError } = await supabase
          .from('simple_bestellpositionen_2025_11_06_21_00')
          .select('*')
          .eq('bestellung_id', id);
        
        if (positionenError) {
          console.error('Fehler beim Laden der Bestellpositionen:', positionenError);
          throw positionenError;
        }
        
        console.log('📦 Gefundene Bestellpositionen:', bestellPositionen);
        
        // Reduziere Lagerbestand für jeden Artikel
        for (const position of bestellPositionen || []) {
          console.log(`📦 Reduziere Lagerbestand für: ${position.produkt_name}, Menge: ${position.menge}`);
          
          // Finde das Produkt in der Shop-Tabelle
          const { data: produkte, error: produktError } = await supabase
            .from('shop_produkte_2025_10_27_14_00')
            .select('*')
            .eq('name', position.produkt_name)
            .single();
          
          if (produktError) {
            console.error(`Produkt nicht gefunden: ${position.produkt_name}`, produktError);
            continue; // Überspringe dieses Produkt, aber setze mit anderen fort
          }
          
          const neuerLagerbestand = (produkte.lagerbestand || 0) - position.menge;
          console.log(`📦 ${position.produkt_name}: ${produkte.lagerbestand} → ${neuerLagerbestand}`);
          
          // Aktualisiere Lagerbestand
          const { error: updateError } = await supabase
            .from('shop_produkte_2025_10_27_14_00')
            .update({ lagerbestand: Math.max(0, neuerLagerbestand) }) // Verhindere negative Bestände
            .eq('id', produkte.id);
          
          if (updateError) {
            console.error(`Fehler beim Aktualisieren des Lagerbestands für ${position.produkt_name}:`, updateError);
          } else {
            console.log(`✅ Lagerbestand aktualisiert für ${position.produkt_name}: ${neuerLagerbestand}`);
          }
        }
        
        console.log('✅ Alle Lagerbestände erfolgreich reduziert!');
      }
      
      const { error } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        console.error('Status update error:', error);
        throw error;
      }
      
      toast({
        title: "Status aktualisiert",
        description: newStatus === 'bestätigt' 
          ? `Bestellung wurde bestätigt und Lagerbestände wurden reduziert.`
          : `Bestellung wurde als ${newStatus} markiert.`,
      });
      
      // Reload data
      await loadBestellungen();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateNotizen = async (bestellungId: string) => {
    try {
      const { error } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .update({ nachricht: notizen })
        .eq('id', bestellungId);

      if (error) throw error;

      toast({
        title: "Notizen aktualisiert",
        description: "Die Notizen wurden erfolgreich gespeichert.",
      });

      await loadBestellungen();
      setSelectedBestellung(null);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Funktion zum Aktualisieren des Bezahlt-Status
  const updateBezahltStatus = async (bestellungId: string, bezahlt: boolean) => {
    try {
      console.log(`💳 Aktualisiere Bezahlt-Status für Bestellung ${bestellungId}: ${bezahlt}`);
      
      const { error } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .update({ bezahlt })
        .eq('id', bestellungId);
      
      if (error) {
        console.error('Fehler beim Aktualisieren des Bezahlt-Status:', error);
        throw error;
      }
      
      toast({
        title: bezahlt ? "Als bezahlt markiert" : "Als unbezahlt markiert",
        description: `Bestellung wurde als ${bezahlt ? 'bezahlt' : 'unbezahlt'} markiert.`,
      });
      
      await loadBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Funktion zum Aktualisieren des Geliefert-Status
  const updateGeliefertStatus = async (bestellungId: string, geliefert: boolean) => {
    try {
      console.log(`📦 Aktualisiere Geliefert-Status für Bestellung ${bestellungId}: ${geliefert}`);
      
      const updateData: any = { geliefert };
      
      // Setze Lieferdatum wenn als geliefert markiert
      if (geliefert) {
        updateData.lieferdatum = new Date().toISOString();
      } else {
        updateData.lieferdatum = null;
      }
      
      const { error } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .update(updateData)
        .eq('id', bestellungId);
      
      if (error) {
        console.error('Fehler beim Aktualisieren des Geliefert-Status:', error);
        throw error;
      }
      
      toast({
        title: geliefert ? "Als geliefert markiert" : "Als nicht geliefert markiert",
        description: `Bestellung wurde als ${geliefert ? 'geliefert' : 'nicht geliefert'} markiert.`,
      });
      
      await loadBestellungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Funktion zum Löschen aller Bestellungen
  const deleteAllBestellungen = async () => {
    try {
      console.log('🗑️ Lösche alle Bestellungen...');
      
      const confirmed = window.confirm('ACHTUNG: Alle Bestellungen löschen?');
      if (!confirmed) return;
      
      const doubleConfirmed = window.confirm('Sind Sie sicher?');
      if (!doubleConfirmed) return;
      
      setLoading(true);
      
      // Lösche Bestellpositionen
      console.log('🗑️ Schritt 1: Lösche alle Bestellpositionen...');
      
      // Verwende gt() mit einem sehr kleinen Wert um alle Datensätze zu löschen
      const { error: positionenError, count: positionenCount } = await supabase
        .from('simple_bestellpositionen_2025_11_06_21_00')
        .delete({ count: 'exact' })
        .gt('created_at', '1900-01-01'); // Löscht alle Datensätze nach 1900
      
      console.log('📊 Bestellpositionen Lösch-Ergebnis:', { error: positionenError, count: positionenCount });
      
      if (positionenError) {
        console.error('❌ Fehler beim Löschen der Bestellpositionen:', positionenError);
        throw positionenError;
      }
      
      console.log(`✅ ${positionenCount || 0} Bestellpositionen gelöscht`);
      
      // Lösche Bestellungen
      console.log('🗑️ Schritt 2: Lösche alle Bestellungen...');
      
      // Verwende gt() mit einem sehr kleinen Wert um alle Datensätze zu löschen
      const { error: bestellungenError, count: bestellungenCount } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .delete({ count: 'exact' })
        .gt('created_at', '1900-01-01'); // Löscht alle Datensätze nach 1900
      
      console.log('📊 Bestellungen Lösch-Ergebnis:', { error: bestellungenError, count: bestellungenCount });
      
      if (bestellungenError) {
        console.error('❌ Fehler beim Löschen der Bestellungen:', bestellungenError);
        throw bestellungenError;
      }
      
      console.log(`✅ ${bestellungenCount || 0} Bestellungen gelöscht`);
      
      toast({
        title: "Alle Bestellungen gelöscht",
        description: `${bestellungenCount || 0} Bestellungen und ${positionenCount || 0} Bestellpositionen gelöscht.`,
      });
      await loadBestellungen();
      
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Neue Lieferschein-PDF Funktion basierend auf Lieferschein_B Vorlage
  const generateLieferschein = async (bestellung: ShopBestellung) => {
    try {
      console.log('📦 Generiere Lieferschein für Bestellung:', bestellung.bestellnummer);
      
      // Dynamischer Import von jsPDF
      const { jsPDF } = await import('jspdf');
      
      // Lade Bestellpositionen
      const { data: bestellPositionen } = await supabase
        .from('simple_bestellpositionen_2025_11_06_21_00')
        .select('*')
        .eq('bestellung_id', bestellung.id);
      
      const doc = new jsPDF();
      
      // === HEADER BEREICH ===
      // Firmenname (groß und fett)
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Jagd Weetzen', 20, 25);
      
      // Firmenadresse
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Am Denkmal 16 • 30952 Linderte', 20, 35);
      doc.text('Tel: +49 172 5265166 • info@jagd-weetzen.de', 20, 42);
      
      // LIEFERSCHEIN Titel (groß und zentriert)
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('LIEFERSCHEIN', 105, 60, { align: 'center' });
      
      // === LIEFERADRESSE BEREICH ===
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Lieferadresse:', 20, 80);
      
      doc.setFont('helvetica', 'normal');
      doc.text(bestellung.kunde_name, 20, 90);
      doc.text(`E-Mail: ${bestellung.kunde_email}`, 20, 97);
      doc.text(`Tel: ${bestellung.kunde_telefon}`, 20, 104);
      
      // Adresse (falls vorhanden)
      if (bestellung.kunde_adresse) {
        const adressLines = bestellung.kunde_adresse.split('\n');
        let yPos = 111;
        adressLines.forEach(line => {
          doc.text(line, 20, yPos);
          yPos += 7;
        });
      }
      
      // === LIEFERSCHEIN DETAILS ===
      const lieferscheinNr = `LS-${bestellung.bestellnummer.replace('#', '')}`;
      const heute = new Date().toLocaleDateString('de-DE');
      const abholzeit = '10:00'; // Standard Abholzeit
      
      doc.setFontSize(10);
      doc.text(`Lieferschein-Nr.: ${lieferscheinNr}`, 20, 140);
      doc.text(`Bestellnummer: ${bestellung.bestellnummer}`, 20, 147);
      doc.text(`Datum: ${heute}`, 20, 154);
      doc.text(`Abholung: ${heute} um ${abholzeit}`, 20, 161);
      doc.text(`Status: ${bestellung.status}`, 20, 168);
      
      // === ARTIKEL TABELLE (OHNE PREISE) ===
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      
      // Tabellen-Header
      const startY = 185;
      doc.text('Pos.', 20, startY);
      doc.text('Artikel', 40, startY);
      doc.text('Menge', 150, startY);
      
      // Linie unter Header
      doc.line(20, startY + 3, 180, startY + 3);
      
      // Artikel auflisten
      doc.setFont('helvetica', 'normal');
      let yPos = startY + 15;
      
      if (bestellPositionen && bestellPositionen.length > 0) {
        bestellPositionen.forEach((position, index) => {
          doc.text(`${index + 1}`, 20, yPos);
          doc.text(position.produkt_name, 40, yPos);
          doc.text(`${position.menge}`, 150, yPos);
          yPos += 12;
        });
      } else {
        doc.text('Keine Artikel gefunden', 40, yPos);
        yPos += 12;
      }
      
      // === UNTERSCHRIFTSBEREICH ===
      const signatureY = Math.max(yPos + 30, 240);
      
      // Linie für Unterschrift
      doc.line(20, signatureY, 90, signatureY);
      doc.text('Unterschrift Empfänger', 20, signatureY + 10);
      
      doc.line(110, signatureY, 180, signatureY);
      doc.text('Datum / Uhrzeit', 110, signatureY + 10);
      
      // === FOOTER ===
      doc.setFontSize(8);
      doc.text('Jagd Weetzen - Nachhaltige Jagd in Niedersachsen', 20, 280);
      doc.text('Vielen Dank für Ihr Vertrauen!', 20, 287);
      
      // PDF speichern
      const fileName = `Lieferschein_${bestellung.bestellnummer.replace('#', '')}_${heute.replace(/\./g, '-')}.pdf`;
      doc.save(fileName);
      
      console.log('✅ Lieferschein erfolgreich generiert:', fileName);
      
      toast({
        title: "Lieferschein erstellt",
        description: `Lieferschein ${lieferscheinNr} wurde erfolgreich generiert.`,
      });
      
    } catch (error: any) {
      console.error('Fehler beim Generieren des Lieferscheins:', error);
      toast({
        title: "Fehler beim Generieren",
        description: "Der Lieferschein konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  const generatePDF = async (bestellung: ShopBestellung) => {
    try {
      // Dynamischer Import von jsPDF
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const bestellPositionen = positionen[bestellung.id] || [];
      
      // Jagdliches Design - Grüne Farben
      const jagdGruen = [34, 139, 34];
      const dunkelGruen = [0, 100, 0];
      
      // Jagdlicher Header mit grünem Hintergrund
      doc.setFillColor(...jagdGruen);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('🦌 JAGDREVIER LIEFERSCHEIN 🦌', 105, 25, { align: 'center' });
      
      // Zurück zu schwarzer Schrift
      doc.setTextColor(0, 0, 0);
      
      // Bestellinformationen
      doc.setFontSize(14);
      doc.setTextColor(...dunkelGruen);
      doc.text('📋 BESTELLINFORMATIONEN', 20, 55);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Bestellnummer: ${bestellung.bestellnummer}`, 20, 70);
      doc.text(`Datum: ${new Date(bestellung.bestelldatum).toLocaleDateString('de-DE')}`, 20, 80);
      doc.text(`Status: ${bestellung.status.toUpperCase()}`, 20, 90);
      
      // Kundeninformationen
      doc.text('Kunde:', 20, 90);
      doc.text(`Name: ${bestellung.kunde_name}`, 20, 100);
      doc.text(`E-Mail: ${bestellung.kunde_email}`, 20, 110);
      doc.text(`Telefon: ${bestellung.kunde_telefon}`, 20, 120);
      doc.text(`Adresse: ${bestellung.kunde_adresse}`, 20, 130);
      
      // Bestellpositionen
      doc.text('Bestellte Artikel:', 20, 150);
      let yPos = 160;
      
      if (bestellPositionen.length > 0) {
        bestellPositionen.forEach((position, index) => {
          doc.text(`${index + 1}. ${position.produkt_name}`, 20, yPos);
          doc.text(`   Menge: ${position.menge}`, 20, yPos + 10);
          yPos += 30;
        });
      } else {
        doc.text('Details nicht verfügbar (migrierte Bestellung)', 20, yPos);
        yPos += 20;
      }
      
      // Gesamtpreis entfernt - keine Preise im PDF
      
      // Notizen
      if (bestellung.notizen) {
        doc.setFontSize(12);
        doc.text('Notizen:', 20, yPos + 40);
        doc.text(bestellung.notizen, 20, yPos + 50);
      }
      
      doc.save(`Lieferschein_${bestellung.bestellnummer}.pdf`);
      
      toast({
        title: "PDF erstellt",
        description: "Der Lieferschein wurde erfolgreich heruntergeladen.",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF-Fehler",
        description: "Fehler beim Erstellen des PDFs: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Status Badge Komponente
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'neu':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Neu
          </Badge>
        );
      case 'bestätigt':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Bestätigt
          </Badge>
        );
      case 'storniert':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Storniert
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const openBestellungDetails = (bestellung: ShopBestellung) => {
    console.log('👁️ Öffne Bestelldetails für:', bestellung.bestellnummer);
    setSelectedBestellung(bestellung);
    setNotizen(bestellung.notizen || '');
    
    // Lade Bestellpositionen für diese spezifische Bestellung
    loadBestellPositionen(bestellung.id);
  };

  // Filter Bestellungen nach Status
  const getFilteredBestellungen = (status: string) => {
    if (status === 'alle') {
      return bestellungen.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return bestellungen
      .filter(b => b.status === status)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Bestellungen-Tabelle Komponente
  const BestellungenTable = ({ bestellungen }: { bestellungen: ShopBestellung[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bestellnummer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Bezahlt</TableHead>
          <TableHead>Geliefert</TableHead>
          <TableHead>Kunde</TableHead>
          <TableHead>E-Mail</TableHead>
          <TableHead>Gesamtpreis</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bestellungen.map((bestellung) => (
          <TableRow key={bestellung.id}>
            <TableCell className="font-medium">
              {bestellung.bestellnummer}
            </TableCell>
            <TableCell>
              {getStatusBadge(bestellung.status)}
            </TableCell>
            <TableCell>
              <Button
                variant={bestellung.bezahlt ? "default" : "outline"}
                size="sm"
                onClick={() => updateBezahltStatus(bestellung.id, !bestellung.bezahlt)}
                className={bestellung.bezahlt ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              >
                {bestellung.bezahlt ? '✅ Bezahlt' : '💳 Offen'}
              </Button>
            </TableCell>
            <TableCell>
              <Button
                variant={bestellung.geliefert ? "default" : "outline"}
                size="sm"
                onClick={() => updateGeliefertStatus(bestellung.id, !bestellung.geliefert)}
                className={bestellung.geliefert ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
              >
                {bestellung.geliefert ? '📦 Geliefert' : '🚚 Offen'}
              </Button>
            </TableCell>
            <TableCell>{bestellung.kunde_name}</TableCell>
            <TableCell>{bestellung.kunde_email}</TableCell>
            <TableCell>{bestellung.gesamtpreis.toFixed(2)}€</TableCell>
            <TableCell>
              {new Date(bestellung.bestelldatum).toLocaleDateString('de-DE')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {/* Status-Änderungs-Buttons */}
                {bestellung.status === 'neu' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBestellungStatus(bestellung.id, 'bestätigt')}
                      className="text-green-600 hover:text-green-700"
                      title="Bestellung bestätigen"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBestellungStatus(bestellung.id, 'storniert')}
                      className="text-red-600 hover:text-red-700"
                      title="Bestellung stornieren"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Für bestätigte und stornierte Bestellungen: Status zurücksetzen */}
                {(bestellung.status === 'bestätigt' || bestellung.status === 'storniert') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateBestellungStatus(bestellung.id, 'neu')}
                    className="text-blue-600 hover:text-blue-700"
                    title="Status zurücksetzen auf Neu"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Details Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"

                      title="Details anzeigen"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Bestelldetails - {bestellung.bestellnummer}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-6">
                        {/* Kundeninformationen */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Bestellinformationen
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p><strong>Bestellnummer:</strong> {bestellung.bestellnummer}</p>
                              <p><strong>Datum:</strong> {new Date(bestellung.bestelldatum).toLocaleDateString('de-DE')}</p>
                              <p><strong>Status:</strong> {getStatusBadge(bestellung.status)}</p>
                              <p><strong>Gesamtpreis:</strong> {bestellung.gesamtpreis.toFixed(2)}€</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Kundeninformationen
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p><strong>Name:</strong> {bestellung.kunde_name}</p>
                              <p><strong>E-Mail:</strong> {bestellung.kunde_email}</p>
                              <p><strong>Telefon:</strong> {bestellung.kunde_telefon}</p>
                              <p><strong>Adresse:</strong> {bestellung.kunde_adresse}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bestellpositionen */}
                        <div>
                          <h3 className="font-semibold mb-2">Bestellte Artikel</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Artikel</TableHead>
                                <TableHead>Menge</TableHead>
                                <TableHead>Einzelpreis</TableHead>
                                <TableHead>Gesamtpreis</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(positionen[bestellung.id] || []).length > 0 ? (
                                positionen[bestellung.id].map((position) => (
                                  <TableRow key={position.id}>
                                    <TableCell>{position.produkt_name}</TableCell>
                                    <TableCell>{position.menge}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={2} className="text-center text-gray-500">
                                    Keine Artikeldetails verfügbar (migrierte Bestellung)
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Notizen */}
                        <div>
                          <h3 className="font-semibold mb-2">Notizen</h3>
                          <Textarea
                            value={bestellung.notizen || ''}
                            readOnly
                            placeholder="Notizen zur Bestellung..."
                            className="min-h-[100px]"
                          />

                        </div>

                        {/* Aktionen */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => generateLieferschein(selectedBestellung)}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Lieferschein (ohne Preise)
                          </Button>
                          <Button
                            onClick={() => generatePDF(bestellung)}
                            variant="outline"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            PDF Bestellbestätigung
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  useEffect(() => {
    loadBestellungen();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Lade Bestellungen...</span>
      </div>
    );
  }

  const neueBestellungen = getFilteredBestellungen('neu');
  const bestaetigteBestellungen = getFilteredBestellungen('bestätigt');
  const stornierteBestellungen = getFilteredBestellungen('storniert');
  const alleBestellungen = getFilteredBestellungen('alle');

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Bestellverwaltung mit Status-Tabs
          </CardTitle>
          <div className="flex justify-end gap-2">
            <Button
              onClick={deleteAllBestellungen}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              title="ALLE Bestellungen löschen (Vorsicht!)"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Alle löschen
            </Button>
            <Button onClick={loadBestellungen} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="alle" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Alle ({alleBestellungen.length})
              </TabsTrigger>
              <TabsTrigger value="neu" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Neue ({neueBestellungen.length})
              </TabsTrigger>
              <TabsTrigger value="bestätigt" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Bestätigt ({bestaetigteBestellungen.length})
              </TabsTrigger>
              <TabsTrigger value="storniert" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Storniert ({stornierteBestellungen.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="alle" className="mt-6">
              {alleBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={alleBestellungen} />
              )}
            </TabsContent>
            
            <TabsContent value="neu" className="mt-6">
              {neueBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine neuen Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={neueBestellungen} />
              )}
            </TabsContent>
            
            <TabsContent value="bestätigt" className="mt-6">
              {bestaetigteBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine bestätigten Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={bestaetigteBestellungen} />
              )}
            </TabsContent>
            
            <TabsContent value="storniert" className="mt-6">
              {stornierteBestellungen.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine stornierten Bestellungen vorhanden</p>
                </div>
              ) : (
                <BestellungenTable bestellungen={stornierteBestellungen} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};