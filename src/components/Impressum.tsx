import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Shield, 
  Scale, 
  FileText, 
  Mail, 
  Phone, 
  MapPin,
  Gavel,
  Lock,
  TreePine
} from 'lucide-react';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-green-800">
              Impressum
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rechtliche Informationen gemäß § 5 TMG für das Jagdrevier Weetzen
          </p>
        </div>

        {/* Anbieter Information */}
        <Card className="mb-8 shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              Anbieter Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  Jagdrevier Weetzen
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Jagdpächter:</strong> [Name des Jagdpächters]</p>
                  <p><strong>Jagdschein-Nr.:</strong> [Jagdschein-Nr.]</p>
                  <p><strong>Hegegemeinschaft:</strong> [Hegegemeinschaft]</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Kontaktdaten
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    [Straße und Hausnummer]<br />
                    [PLZ Ort]
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    [Telefonnummer]
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    [E-Mail-Adresse]
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rechtliche Hinweise */}
        <Card className="mb-8 shadow-lg border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Gavel className="h-6 w-6" />
              Rechtliche Hinweise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Haftungsausschluss (§ 5 TMG)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                  Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                  nach den allgemeinen Gesetzen verantwortlich.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Haftung für Links</h3>
                <p className="text-gray-700 leading-relaxed">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                  Seiten verantwortlich.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Urheberrecht</h3>
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
              <TreePine className="h-6 w-6" />
              Jagdrechtliche Hinweise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Bundesjagdgesetz (BJagdG)</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die Jagdausübung erfolgt ausschließlich im Rahmen der geltenden Bestimmungen des 
                  Bundesjagdgesetzes und der entsprechenden Landesjagdgesetze. Alle jagdlichen Aktivitäten 
                  werden unter Beachtung der Waidgerechtigkeit und des Tierschutzes durchgeführt.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Niedersächsisches Jagdgesetz</h3>
                <p className="text-gray-700 leading-relaxed">
                  Das Jagdrevier unterliegt den Bestimmungen des Niedersächsischen Jagdgesetzes (NJagdG). 
                  Die Jagdausübung erfolgt unter Berücksichtigung der ökologischen Zusammenhänge und 
                  der Grundsätze einer nachhaltigen Nutzung.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Wildschadenverhütung</h3>
                <p className="text-gray-700 leading-relaxed">
                  Als Jagdausübungsberechtigte sind wir zur Wildschadenverhütung verpflichtet und 
                  setzen entsprechende Maßnahmen zur Regulierung der Wildbestände um. Dies erfolgt 
                  im Einklang mit den örtlichen Gegebenheiten und in Abstimmung mit der Landwirtschaft.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Naturschutz und nachhaltige Jagd</h3>
                <p className="text-gray-700 leading-relaxed">
                  Unser Jagdrevier wird nach den Grundsätzen der nachhaltigen Jagd bewirtschaftet. 
                  Naturschutz, Artenschutz und die Erhaltung der biologischen Vielfalt stehen dabei 
                  im Mittelpunkt unserer jagdlichen Tätigkeit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datenschutz */}
        <Card className="mb-8 shadow-lg border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <Lock className="h-6 w-6" />
              Datenschutz
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">DSGVO-konforme Datenverarbeitung</h3>
                <p className="text-gray-700 leading-relaxed">
                  Der Schutz Ihrer persönlichen Daten ist uns wichtig. Wir verarbeiten Ihre Daten 
                  ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). 
                  Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der 
                  Erhebung und Verwendung personenbezogener Daten auf unserer Website auf.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Datenerhebung und -verwendung</h3>
                <p className="text-gray-700 leading-relaxed">
                  Personenbezogene Daten werden nur erhoben, wenn Sie uns diese freiwillig mitteilen, 
                  etwa bei Kontaktaufnahme oder Bestellungen im Wildfleisch-Shop. Diese Daten werden 
                  ausschließlich für den angegebenen Zweck verwendet und nicht an Dritte weitergegeben.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Ihre Rechte</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sie haben jederzeit das Recht auf Auskunft über die Sie betreffenden personenbezogenen 
                  Daten, deren Berichtigung oder Löschung sowie auf Einschränkung der Verarbeitung. 
                  Wenden Sie sich hierzu an die oben angegebenen Kontaktdaten.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontakt für rechtliche Fragen */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              Kontakt für rechtliche Fragen
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Bei Fragen zu diesem Impressum oder rechtlichen Angelegenheiten wenden Sie sich bitte an:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">[Name des Jagdpächters]</p>
              <p className="text-gray-600">[E-Mail-Adresse]</p>
              <p className="text-gray-600">[Telefonnummer]</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Impressum für Jagdrevier Weetzen</p>
          <p className="mt-2">Stand: Oktober 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Impressum;