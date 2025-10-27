import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Mail, User, Phone, MessageSquare } from 'lucide-react';

export const RegistrierungsAnfrage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    username: '',
    phone: '',
    nachricht: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.full_name) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('registrierungsanfragen_2025_10_25_19_00')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Registrierungsanfrage gesendet",
        description: "Ihre Anfrage wurde erfolgreich eingereicht. Sie erhalten eine E-Mail, sobald Ihr Zugang freigeschaltet wurde.",
      });

      setSubmitted(true);
      setFormData({
        email: '',
        full_name: '',
        username: '',
        phone: '',
        nachricht: ''
      });

    } catch (error: any) {
      console.error('Error submitting registration request:', error);
      toast({
        title: "Fehler beim Senden",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Anfrage eingereicht</h3>
            <p className="text-gray-600 mb-4">
              Ihre Registrierungsanfrage wurde erfolgreich eingereicht. 
              Sie erhalten eine E-Mail, sobald Ihr Zugang von einem Administrator freigeschaltet wurde.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Neue Anfrage stellen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Registrierungsanfrage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Neue Benutzerkonten müssen von einem Administrator 
              freigegeben werden. Bitte füllen Sie das Formular aus und warten Sie auf die Bestätigung.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Vollständiger Name *
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                placeholder="Max Mustermann"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail-Adresse *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="max@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                Benutzername (optional)
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="maxmustermann"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefonnummer (optional)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+49 123 456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nachricht" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Nachricht (optional)
              </Label>
              <Textarea
                id="nachricht"
                name="nachricht"
                value={formData.nachricht}
                onChange={handleInputChange}
                rows={3}
                placeholder="Warum möchten Sie Zugang zu diesem System?"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? 'Wird gesendet...' : 'Registrierungsanfrage senden'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              * Pflichtfelder
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};