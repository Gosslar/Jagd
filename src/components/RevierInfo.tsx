import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Shield, Users } from 'lucide-react';

export const RevierInfo: React.FC = () => {
  return (
    <section id="revier" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unser Jagdrevier</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jagd Weetzen erstreckt sich über 340 Hektar naturbelassener Wiesen- und Feldlandschaft 
            in Niedersachsen und bietet optimale Bedingungen für eine nachhaltige Jagd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviergröße</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">340 ha</div>
              <p className="text-xs text-muted-foreground">Wiesen- und Feldlandschaft</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jagdzeit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Apr - Feb</div>
              <p className="text-xs text-muted-foreground">Je nach Wildart</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hochsitze</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Strategisch platziert</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jagdberechtigte</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Erfahrene Jäger</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Jagdzeiten und Bestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Rehwild</span>
                <Badge variant="secondary">Mai - Januar</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Schwarzwild</span>
                <Badge variant="secondary">Ganzjährig</Badge>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Wichtiger Hinweis:</strong> Alle Jagdzeiten entsprechen den aktuellen 
                  landesrechtlichen Bestimmungen. Bitte beachten Sie zusätzliche Schonzeiten 
                  und Revierbeschränkungen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revierausstattung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">8 Hochsitze</h4>
                    <p className="text-sm text-gray-600">Strategisch über das gesamte Revier verteilt</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Wildkameras</h4>
                    <p className="text-sm text-gray-600">Moderne Überwachung des Wildbestands</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Wildäcker</h4>
                    <p className="text-sm text-gray-600">Natürliche Äsungsflächen für das Wild</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Naherholungsgebiet Weetzer Stapelteiche */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Naherholungsgebiet Weetzer Stapelteiche</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Die Stapelteiche Weetzen, gelegen zwischen den Ronnenberger Stadtteilen Weetzen und Vörie, sind ein herausragendes Beispiel für die erfolgreiche Umwandlung einer ehemaligen Industriefläche in ein wertvolles Naherholungs- und Naturschutzgebiet. Was einst als Absetzbecken für eine Zuckerfabrik diente, ist heute das flächenmäßig größte Feuchtbiotop der Region für den Vogelschutz und ein beliebtes Ziel für Naturfreunde, Anwohner und Besucher.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Geschichte und Bedeutung: Von der Industriebrache zum Naturjuwel</h4>
              
              <h5 className="text-md font-medium text-gray-800 mt-6 mb-3">Die Entstehung aus der Zuckerindustrie</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vor über einem Jahrhundert war das Areal eine feuchte Wiesenlandschaft. Mit dem Aufkommen der Zuckerindustrie wurde das Gelände von der Zuckerfabrik Weetzen umgestaltet. Über Rohrleitungen wurde das Waschwasser der Zuckerrüben, das mit Schlamm, Erde und Sand angereichert war, in die Becken geleitet. Dieser Prozess führte zur Sedimentation der Feststoffe. Dabei "stapelte" sich die Erde, was dem Gelände seinen Namen gab: Stapelteiche. Der abgelagerte feine Sand wirkte wie eine natürliche Abdichtung und schuf so die Grundlage für die heutige Teichlandschaft.
              </p>

              <h5 className="text-md font-medium text-gray-800 mt-6 mb-3">Der Wandel zum Schutzgebiet</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nach der Schließung der Zuckerfabrik im Jahr 1993 stand die Zukunft des Geländes auf dem Spiel. Ursprüngliche Verträge sahen vor, das Areal wieder in ackerfähiges Land umzuwandeln. Naturschützer erkannten jedoch das immense Potenzial der sich bereits entwickelnden Landschaft als Lebensraum für zahlreiche Tier- und Pflanzenarten. Sie befürchteten, dass ein Rückbau den Verlust eines wichtigen Rückzugsgebiets für bis zu 170 Vogelarten bedeuten würde.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Durch das Engagement von Naturschützern und der Region Hannover konnte dies verhindert werden. Im Zuge einer Flurbereinigung wurde das rund 20 Hektar große Gelände an mehrere Parteien veräußert, die sich dem Naturschutz verschrieben haben. Diese Initiative war ein Meilenstein für den regionalen Naturschutz und sicherte die Zukunft der Stapelteiche als ökologisch wertvolles Biotop.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Natur und Umwelt: Ein Mosaik des Lebens</h4>
              
              <h5 className="text-md font-medium text-gray-800 mt-6 mb-3">Landschaftsmerkmale</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                Das Gebiet ist geprägt von einem vielfältigen Mosaik aus offenen Wasserflächen, Schilfzonen, Erlen- und Pappelwäldern sowie Dämmen und Wiesen. Eine Besonderheit sind die ausgedehnten Schlickflächen, die bei sinkendem Wasserstand entstehen. Diese Flächen dienen als wichtige Rast- und Nahrungsplätze für zahlreiche Vogelarten, insbesondere für Watvögel während des Vogelzugs im Frühjahr und Herbst.
              </p>

              <h5 className="text-md font-medium text-gray-800 mt-6 mb-3">Fauna: Ein Paradies für Vögel und mehr</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Stapelteiche sind vor allem als Vogelparadies bekannt. Laut Berichten wurden hier bis zu <strong>275 verschiedene Vogelarten</strong> als Brut- oder Rastvögel nachgewiesen. Die Vielfalt umfasst:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-blue-900 mb-2">Brutvögel</h6>
                  <p className="text-sm text-blue-800">Haubentaucher, Zwergtaucher, Rohrweihe, Rohrammer, Teichrohrsänger und verschiedene Entenarten. Der farbenprächtige Eisvogel ist ein ständiger Gast an den Teichen.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-green-900 mb-2">Zugvögel</h6>
                  <p className="text-sm text-green-800">Im Frühjahr und Herbst rasten hier Arten wie Bekassine, Kampfläufer, Uferschnepfe und Rotschenkel.</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-amber-900 mb-2">Weitere bemerkenswerte Arten</h6>
                  <p className="text-sm text-amber-800">Silberreiher, Graureiher, Weißstorch (in einem bereitgestellten Nest), Rotmilan und gelegentlich sogar der Fischadler.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-purple-900 mb-2">Weitere Fauna</h6>
                  <p className="text-sm text-purple-800">Wildschweine, Füchse, Waschbären, Amphibien und bis zu 30 verschiedene Libellenarten.</p>
                </div>
              </div>

              <h5 className="text-md font-medium text-gray-800 mt-6 mb-3">Die Rolle der Wasserbüffel in der Landschaftspflege</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ein besonderes Highlight ist eine Herde von über <strong>20 Wasserbüffeln</strong>, die seit 2011 als "tierische Landschaftspfleger" eingesetzt werden. Ihre Aufgaben sind vielfältig:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li><strong>Offenhaltung der Flächen:</strong> Durch das Abweiden von Schilf, Binsen und aufkommenden Gehölzen verhindern sie die Verbuschung</li>
                <li><strong>Schaffung von Kleinstlebensräumen:</strong> Ihre Trittsiegel werden zu temporären Laichgewässern für Amphibien</li>
                <li><strong>Verhinderung der Verlandung:</strong> Durch das Suhlen halten sie Wasserflächen offen</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Freizeitaktivitäten und Erholung</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-gray-900 mb-2">🔭 Naturbeobachtung</h6>
                  <p className="text-sm text-gray-700">Zwei Beobachtungshütten ermöglichen ungestörte Tierbeobachtung und Fotografie.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-gray-900 mb-2">🚶 Wandern & Radfahren</h6>
                  <p className="text-sm text-gray-700">Zentrale Station auf dem "Natur-Erlebnisweg" mit informativen Tafeln.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h6 className="font-semibold text-gray-900 mb-2">👥 Geführte Exkursionen</h6>
                  <p className="text-sm text-gray-700">Regelmäßige Touren von lokalen Naturschutzexperten.</p>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Besucherinformationen</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Stapelteiche Weetzen liegen etwa 12 km südwestlich von Hannover zwischen den Ortschaften Weetzen und Vörie. Der Zugang erfolgt über die Kreisstraße K228. Parkmöglichkeiten befinden sich auf der Westseite der Straße in der Nähe einer Informationstafel zu den Wasserbüffeln.
              </p>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800 font-medium">
                  <strong>Wichtiger Hinweis:</strong> Besucher werden gebeten, auf den Wegen zu bleiben und die Natur mit Respekt zu behandeln, um den Fortbestand dieses einzigartigen Lebensraums zu sichern.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};