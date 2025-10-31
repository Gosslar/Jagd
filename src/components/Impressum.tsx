import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Shield, FileText, Users } from 'lucide-react';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Impressum
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rechtliche Angaben gemäß § 5 TMG (Telemediengesetz)
          </p>
        </div>

        {/* Anbieter Information */}
        <Card className="mb-8 shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              Anbieter der Website
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-800 mb-3">Verantwortlich für den Inhalt:</h3>
                <div className="space-y-2 text-gray-700">
                  <p className="font-medium">Jagdrevier Weetzen</p>
                  <p>Inhaber: [Name des Jagdpächters]</p>
                  <p>Jagdschein-Nr.: [Nummer]</p>
                  <p>Hegegemeinschaft: [Name]</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-3">Kontaktdaten:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p>[Straße und Hausnummer]</p>
                      <p>[PLZ] Weetzen</p>
                      <p>Deutschland</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <p>Telefon: [Telefonnummer]</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <p>E-Mail: [E-Mail-Adresse]</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rechtliche Hinweise */}
        <Card className="mb-8 shadow-lg border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              Rechtliche Hinweise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-amber-800 mb-3">Haftungsausschluss:</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                  Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                  nach den allgemeinen Gesetzen verantwortlich.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-amber-800 mb-3">Haftung für Links:</h3>
                <p className="text-gray-700 leading-relaxed">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                  Seiten verantwortlich.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-amber-800 mb-3">Urheberrecht:</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                  dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                  der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                  Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jagdrechtliche Hinweise */}
        <Card className="mb-8 shadow-lg border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              Jagdrechtliche Hinweise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-orange-800 mb-3">Jagdausübung:</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die Jagd wird ausschließlich nach den Bestimmungen des Bundesjagdgesetzes (BJagdG) 
                  und des Niedersächsischen Jagdgesetzes (NJagdG) ausgeübt. Alle Jagdzeiten und 
                  Schonzeiten werden strikt eingehalten.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-orange-800 mb-3">Wildschadenverhütung:</h3>
                <p className="text-gray-700 leading-relaxed">
                  Als Jagdpächter sind wir zur Wildschadenverhütung verpflichtet und arbeiten eng 
                  mit den örtlichen Landwirten zusammen. Wildschäden werden nach den gesetzlichen 
                  Bestimmungen reguliert.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-orange-800 mb-3">Naturschutz:</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wir praktizieren eine nachhaltige Jagd im Einklang mit dem Naturschutz. 
                  Biotopverbesserung und Artenschutz sind wichtige Bestandteile unserer Hegemaßnahmen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datenschutz */}
        <Card className="mb-8 shadow-lg border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              Datenschutz
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Website erhebt und 
                verarbeitet personenbezogene Daten nur im Rahmen der gesetzlichen Bestimmungen 
                der Datenschutz-Grundverordnung (DSGVO).
              </p>
              
              <div>
                <h3 className="font-semibold text-blue-800 mb-3">Datenerhebung:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Technische Daten beim Besuch der Website (IP-Adresse, Browser, etc.)</li>
                  <li>Kontaktdaten bei Nutzung des Kontaktformulars</li>
                  <li>Registrierungsdaten bei Nutzung des Webshops</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-800 mb-3">Ihre Rechte:</h3>
                <p className="text-gray-700">
                  Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung 
                  der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns bei 
                  Fragen zum Datenschutz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontakt für rechtliche Fragen */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <CardTitle>Kontakt für rechtliche Fragen</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Bei Fragen zu diesem Impressum oder rechtlichen Angelegenheiten wenden Sie sich bitte an:
            </p>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <p className="text-gray-700">[E-Mail-Adresse für rechtliche Fragen]</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Stand: {new Date().toLocaleDateString('de-DE')}</p>
          <p className="mt-2">Jagdrevier Weetzen - Nachhaltige Jagd im Einklang mit der Natur</p>
        </div>
      </div>
    </div>
  );
};

export default Impressum;