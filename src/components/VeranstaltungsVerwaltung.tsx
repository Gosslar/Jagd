import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';

interface Veranstaltung {
  id: string;
  titel: string;
  beschreibung: string;
  kategorie: string;
  startdatum: string;
  enddatum: string | null;
  startzeit: string | null;
  endzeit: string | null;
  ganztaegig: boolean;
  ort: string | null;
  max_teilnehmer: number | null;
  anmeldung_erforderlich: boolean;
  anmeldeschluss: string | null;
  status: 'geplant' | 'bestaetigt' | 'abgesagt' | 'verschoben' | 'abgeschlossen';
  prioritaet: 'niedrig' | 'normal' | 'hoch' | 'kritisch';
  farbe: string;
  notizen: string | null;
  created_at: string;
  updated_at: string;
}

const KATEGORIEN = [
  'Jagd',
  'Wartung', 
  'Verwaltung',
  'Revierpflege',
  'Schulung',
  'Versammlung',
  'Allgemein'
];

const STATUS_OPTIONS = [
  { value: 'geplant', label: 'Geplant', color: 'bg-blue-100 text-blue-800' },
  { value: 'bestaetigt', label: 'Bestätigt', color: 'bg-green-100 text-green-800' },
  { value: 'abgesagt', label: 'Abgesagt', color: 'bg-red-100 text-red-800' },
  { value: 'verschoben', label: 'Verschoben', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'abgeschlossen', label: 'Abgeschlossen', color: 'bg-gray-100 text-gray-800' }
];

const PRIORITAET_OPTIONS = [
  { value: 'niedrig', label: 'Niedrig', color: 'bg-gray-100 text-gray-800' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  { value: 'hoch', label: 'Hoch', color: 'bg-orange-100 text-orange-800' },
  { value: 'kritisch', label: 'Kritisch', color: 'bg-red-100 text-red-800' }
];

const KATEGORIE_FARBEN: { [key: string]: string } = {
  'Jagd': '#dc2626',
  'Wartung': '#059669',
  'Verwaltung': '#7c3aed',
  'Revierpflege': '#ea580c',
  'Schulung': '#0284c7',
  'Versammlung': '#7c2d12',
  'Allgemein': '#374151'
};

export const VeranstaltungsVerwaltung = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [veranstaltungen, setVeranstaltungen] = useState<Veranstaltung[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVeranstaltung, setEditingVeranstaltung] = useState<Veranstaltung | null>(null);
  const [filterKategorie, setFilterKategorie] = useState<string>('alle');
  const [filterStatus, setFilterStatus] = useState<string>('alle');

  // Form State
  const [formData, setFormData] = useState({
    titel: '',
    beschreibung: '',
    kategorie: 'Allgemein',
    startdatum: '',
    enddatum: '',
    startzeit: '',
    endzeit: '',
    ganztaegig: false,
    ort: '',
    max_teilnehmer: '',
    anmeldung_erforderlich: false,
    anmeldeschluss: '',
    status: 'geplant' as const,
    prioritaet: 'normal' as const,
    farbe: '#10b981',
    notizen: ''
  });

  useEffect(() => {
    loadVeranstaltungen();
  }, []);

  const loadVeranstaltungen = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('veranstaltungen_2025_10_27_18_00')
        .select('*')
        .order('startdatum', { ascending: true });

      if (error) throw error;
      setVeranstaltungen(data || []);
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

  const openDialog = (veranstaltung?: Veranstaltung) => {
    if (veranstaltung) {
      setEditingVeranstaltung(veranstaltung);
      setFormData({
        titel: veranstaltung.titel,
        beschreibung: veranstaltung.beschreibung || '',
        kategorie: veranstaltung.kategorie,
        startdatum: veranstaltung.startdatum,
        enddatum: veranstaltung.enddatum || '',
        startzeit: veranstaltung.startzeit || '',
        endzeit: veranstaltung.endzeit || '',
        ganztaegig: veranstaltung.ganztaegig,
        ort: veranstaltung.ort || '',
        max_teilnehmer: veranstaltung.max_teilnehmer?.toString() || '',
        anmeldung_erforderlich: veranstaltung.anmeldung_erforderlich,
        anmeldeschluss: veranstaltung.anmeldeschluss || '',
        status: veranstaltung.status,
        prioritaet: veranstaltung.prioritaet,
        farbe: veranstaltung.farbe,
        notizen: veranstaltung.notizen || ''
      });
    } else {
      setEditingVeranstaltung(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      titel: '',
      beschreibung: '',
      kategorie: 'Allgemein',
      startdatum: '',
      enddatum: '',
      startzeit: '',
      endzeit: '',
      ganztaegig: false,
      ort: '',
      max_teilnehmer: '',
      anmeldung_erforderlich: false,
      anmeldeschluss: '',
      status: 'geplant',
      prioritaet: 'normal',
      farbe: '#10b981',
      notizen: ''
    });
  };

  const handleKategorieChange = (kategorie: string) => {
    setFormData(prev => ({
      ...prev,
      kategorie,
      farbe: KATEGORIE_FARBEN[kategorie] || '#10b981'
    }));
  };

  const saveVeranstaltung = async () => {
    try {
      const veranstaltungData = {
        titel: formData.titel,
        beschreibung: formData.beschreibung || null,
        kategorie: formData.kategorie,
        startdatum: formData.startdatum,
        enddatum: formData.enddatum || null,
        startzeit: formData.startzeit || null,
        endzeit: formData.endzeit || null,
        ganztaegig: formData.ganztaegig,
        ort: formData.ort || null,
        max_teilnehmer: formData.max_teilnehmer ? parseInt(formData.max_teilnehmer) : null,
        anmeldung_erforderlich: formData.anmeldung_erforderlich,
        anmeldeschluss: formData.anmeldeschluss || null,
        status: formData.status,
        prioritaet: formData.prioritaet,
        farbe: formData.farbe,
        notizen: formData.notizen || null
      };

      if (editingVeranstaltung) {
        const { error } = await supabase
          .from('veranstaltungen_2025_10_27_18_00')
          .update(veranstaltungData)
          .eq('id', editingVeranstaltung.id);

        if (error) throw error;

        toast({
          title: "Veranstaltung aktualisiert",
          description: "Die Veranstaltung wurde erfolgreich aktualisiert.",
        });
      } else {
        const { error } = await supabase
          .from('veranstaltungen_2025_10_27_18_00')
          .insert([veranstaltungData]);

        if (error) throw error;

        toast({
          title: "Veranstaltung erstellt",
          description: "Die neue Veranstaltung wurde erfolgreich erstellt.",
        });
      }

      setDialogOpen(false);
      loadVeranstaltungen();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteVeranstaltung = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('veranstaltungen_2025_10_27_18_00')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Veranstaltung gelöscht",
        description: "Die Veranstaltung wurde erfolgreich gelöscht.",
      });

      loadVeranstaltungen();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption ? (
      <Badge className={statusOption.color}>
        {statusOption.label}
      </Badge>
    ) : null;
  };

  const getPrioritaetBadge = (prioritaet: string) => {
    const prioritaetOption = PRIORITAET_OPTIONS.find(p => p.value === prioritaet);
    return prioritaetOption ? (
      <Badge variant="outline" className={prioritaetOption.color}>
        {prioritaetOption.label}
      </Badge>
    ) : null;
  };

  const formatDatum = (datum: string) => {
    return new Date(datum).toLocaleDateString('de-DE');
  };

  const formatZeit = (zeit: string | null) => {
    if (!zeit) return '';
    return zeit.substring(0, 5); // HH:MM
  };

  const filteredVeranstaltungen = veranstaltungen.filter(v => {
    const kategorieMatch = filterKategorie === 'alle' || v.kategorie === filterKategorie;
    const statusMatch = filterStatus === 'alle' || v.status === filterStatus;
    return kategorieMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Lade Veranstaltungen...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Veranstaltungskalender ({filteredVeranstaltungen.length})
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Neue Veranstaltung
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingVeranstaltung ? 'Veranstaltung bearbeiten' : 'Neue Veranstaltung'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="titel">Titel *</Label>
                    <Input
                      id="titel"
                      value={formData.titel}
                      onChange={(e) => setFormData(prev => ({ ...prev, titel: e.target.value }))}
                      placeholder="Veranstaltungstitel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="kategorie">Kategorie</Label>
                    <Select value={formData.kategorie} onValueChange={handleKategorieChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {KATEGORIEN.map(kategorie => (
                          <SelectItem key={kategorie} value={kategorie}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: KATEGORIE_FARBEN[kategorie] }}
                              />
                              {kategorie}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startdatum">Startdatum *</Label>
                    <Input
                      id="startdatum"
                      type="date"
                      value={formData.startdatum}
                      onChange={(e) => setFormData(prev => ({ ...prev, startdatum: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="enddatum">Enddatum</Label>
                    <Input
                      id="enddatum"
                      type="date"
                      value={formData.enddatum}
                      onChange={(e) => setFormData(prev => ({ ...prev, enddatum: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="startzeit">Startzeit</Label>
                    <Input
                      id="startzeit"
                      type="time"
                      value={formData.startzeit}
                      onChange={(e) => setFormData(prev => ({ ...prev, startzeit: e.target.value }))}
                      disabled={formData.ganztaegig}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endzeit">Endzeit</Label>
                    <Input
                      id="endzeit"
                      type="time"
                      value={formData.endzeit}
                      onChange={(e) => setFormData(prev => ({ ...prev, endzeit: e.target.value }))}
                      disabled={formData.ganztaegig}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="ort">Ort</Label>
                    <Input
                      id="ort"
                      value={formData.ort}
                      onChange={(e) => setFormData(prev => ({ ...prev, ort: e.target.value }))}
                      placeholder="Veranstaltungsort"
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_teilnehmer">Max. Teilnehmer</Label>
                    <Input
                      id="max_teilnehmer"
                      type="number"
                      value={formData.max_teilnehmer}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_teilnehmer: e.target.value }))}
                      placeholder="Unbegrenzt"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prioritaet">Priorität</Label>
                    <Select value={formData.prioritaet} onValueChange={(value: any) => setFormData(prev => ({ ...prev, prioritaet: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITAET_OPTIONS.map(prioritaet => (
                          <SelectItem key={prioritaet.value} value={prioritaet.value}>
                            {prioritaet.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="beschreibung">Beschreibung</Label>
                    <Textarea
                      id="beschreibung"
                      value={formData.beschreibung}
                      onChange={(e) => setFormData(prev => ({ ...prev, beschreibung: e.target.value }))}
                      placeholder="Detaillierte Beschreibung der Veranstaltung"
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="notizen">Interne Notizen</Label>
                    <Textarea
                      id="notizen"
                      value={formData.notizen}
                      onChange={(e) => setFormData(prev => ({ ...prev, notizen: e.target.value }))}
                      placeholder="Interne Notizen (nur für Administratoren sichtbar)"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ganztaegig"
                      checked={formData.ganztaegig}
                      onChange={(e) => setFormData(prev => ({ ...prev, ganztaegig: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="ganztaegig">Ganztägig</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anmeldung_erforderlich"
                      checked={formData.anmeldung_erforderlich}
                      onChange={(e) => setFormData(prev => ({ ...prev, anmeldung_erforderlich: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="anmeldung_erforderlich">Anmeldung erforderlich</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={saveVeranstaltung} disabled={!formData.titel || !formData.startdatum}>
                    {editingVeranstaltung ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterKategorie} onValueChange={setFilterKategorie}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Kategorien</SelectItem>
                  {KATEGORIEN.map(kategorie => (
                    <SelectItem key={kategorie} value={kategorie}>
                      {kategorie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Status</SelectItem>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Veranstaltungen Liste */}
          <div className="space-y-4">
            {filteredVeranstaltungen.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Keine Veranstaltungen gefunden.
              </p>
            ) : (
              filteredVeranstaltungen.map((veranstaltung) => (
                <Card key={veranstaltung.id} className="border-l-4" style={{ borderLeftColor: veranstaltung.farbe }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{veranstaltung.titel}</h3>
                          {getStatusBadge(veranstaltung.status)}
                          {getPrioritaetBadge(veranstaltung.prioritaet)}
                          <Badge variant="outline" style={{ backgroundColor: veranstaltung.farbe + '20', color: veranstaltung.farbe }}>
                            {veranstaltung.kategorie}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <div>
                              <div>{formatDatum(veranstaltung.startdatum)}</div>
                              {veranstaltung.enddatum && veranstaltung.enddatum !== veranstaltung.startdatum && (
                                <div>bis {formatDatum(veranstaltung.enddatum)}</div>
                              )}
                            </div>
                          </div>

                          {!veranstaltung.ganztaegig && (veranstaltung.startzeit || veranstaltung.endzeit) && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <div>
                                {formatZeit(veranstaltung.startzeit)}
                                {veranstaltung.endzeit && ` - ${formatZeit(veranstaltung.endzeit)}`}
                              </div>
                            </div>
                          )}

                          {veranstaltung.ort && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <div>{veranstaltung.ort}</div>
                            </div>
                          )}

                          {veranstaltung.max_teilnehmer && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <div>Max. {veranstaltung.max_teilnehmer} Teilnehmer</div>
                            </div>
                          )}
                        </div>

                        {veranstaltung.beschreibung && (
                          <p className="text-gray-700 mb-3">{veranstaltung.beschreibung}</p>
                        )}

                        {veranstaltung.anmeldung_erforderlich && (
                          <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Anmeldung erforderlich</span>
                            {veranstaltung.anmeldeschluss && (
                              <span>bis {formatDatum(veranstaltung.anmeldeschluss)}</span>
                            )}
                          </div>
                        )}

                        {veranstaltung.notizen && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                            <strong>Interne Notizen:</strong> {veranstaltung.notizen}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(veranstaltung)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteVeranstaltung(veranstaltung.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};