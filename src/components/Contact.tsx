import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from('contact_requests_2025_10_23_06_04').insert([formData]);
      if (error) throw error;
      toast({
        title: "Nachricht gesendet",
        description: "Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden."
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Senden",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kontakt</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Haben Sie Fragen zu unserem Jagdrevier oder möchten Sie mehr über 
            Jagdmöglichkeiten erfahren? Kontaktieren Sie uns gerne.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-gray-600">info@jagd-weetzen.de</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-gray-600">+49 172 5265166</p>
                  </div>
                </div>
                
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revierpächter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Christoph Burchard</h4>
                    <p className="text-sm text-gray-600">Revierpächter</p>
                    <p className="text-sm text-gray-600">Holtenserstrasse 4</p>
                    <p className="text-sm text-gray-600">30952 Linderte</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Ole Gosslar</h4>
                    <p className="text-sm text-gray-600">Revierpächter</p>
                    <p className="text-sm text-gray-600">Am Denkmal 16</p>
                    <p className="text-sm text-gray-600">30952 Linderte</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Nachricht senden</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? 'Wird gesendet...' : 'Nachricht senden'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};