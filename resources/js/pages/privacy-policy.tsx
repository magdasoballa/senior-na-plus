// Pełna treść Polityki Prywatności z pliku PDF: "4. Polityka prywatności_seniornaplus.pl_29.09.25_MK.pdf"
// Uwaga: zachowano brzmienie i kolejność, łącznie z uwagami [MK1], [MK2].

import AppLayout from '@/layouts/app-layout';

export default function PrivacyPolicyFull() {
    return (
        <AppLayout>
            <div className="mx-auto max-w-4xl px-4 py-10 prose prose-sm sm:prose-base">
                <p className='text-xl mb-5'>Polityka prywatności portalu www.seniornaplus.pl</p>

                {/* I. Słowniczek pojęć */}
                <p className='my-2'><strong>I. Słowniczek pojęć.</strong></p>
                <ol>
                    <li>
                        <strong>Administrator Danych Osobowych/ADO</strong> – spółka Senior na Plus Pflege sp. z o.o. z siedzibą w Warszawie (02-662) przy ul. Świeradowskiej 47, zarejestrowana w rejestrze
                        przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla
                        m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy Krajowego Rejestru Sądowego
                        pod numerem KRS: 0001155432, posiadająca NIP: 5214105615 oraz REGON: 540911002,
                        o kapitale zakładowym 5.000 zł.
                    </li>
                    <li>
                        <strong>Serwis</strong> – należący do ADO serwis internetowy, dostępny na stronie: <a href="http://www.seniornaplus.pl/" className="text-coral underline hover:no-underline">www.seniornaplus.pl</a>.
                    </li>
                    <li>
                        <strong>Kandydat</strong> – osoba fizyczna, mającą co najmniej 18 lat i posiadająca pełną zdolność do czynności prawnych, która prawidłowo wypełniła i wysłała Formularz Rekrutacyjny celem złożenia aplikacji i podjęcia pracy u ADO.
                    </li>
                    <li>
                        <strong>Użytkownik</strong> – Kandydat oraz wszystkie osoby odwiedzające Serwis.
                    </li>
                    <li>
                        <strong>Warunki Korzystania</strong> – warunki korzystania z Serwisu, udostępnione w zakładce pn. „Warunki korzystania”, pod adresem: <a href="/terms-of-use" className="text-coral underline hover:no-underline">Warunki Korzystania</a>.
                    </li>
                    <li>
                        <strong>Formularz Rekrutacyjny</strong> – udostępniony w Serwisie pod adresem <a href="https://seniornaplus.pl/formularz" className="text-coral underline hover:no-underline">https://seniornaplus.pl/formularz</a> lub na stronie głównej <a href="https://seniornaplus.pl/" className="text-coral underline hover:no-underline">https://seniornaplus.pl/</a> (górna sekcja) formularz służący do złożenia aplikacji w celu podjęcia pracy u ADO. Prawidłowe wypełnienie Formularza Rekrutacyjnego oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja Warunków Korzystania z Serwisu oraz Polityki Prywatności Serwisu są niezbędne do prawidłowego wysłania aplikacji.
                    </li>
                    <li>
                        <strong>Oferty Pracy</strong> – oferty zatrudnienia u ADO, w tym także ogłoszenia o pracę opublikowane przez ADO w Serwisie m.in. na stronie głównej, a także w zakładce pn. „Oferty pracy”.
                    </li>
                    <li>
                        <strong>Formularz Kontaktowy</strong> – formularz udostępniony w Serwisie pod adresem: <a href="https://seniornaplus.pl/kontakt" className="text-coral underline hover:no-underline">https://seniornaplus.pl/kontakt</a>, umożliwiający Użytkownikom kontakt z ADO, w tym m.in. skierowanie zapytania do Serwisu. Prawidłowe wypełnienie Formularza Kontaktowego oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja Warunków Korzystania z Serwisu oraz Polityki Prywatności Serwisu są niezbędne do prawidłowego wysłania zapytania.
                    </li>
                    <li>
                        <strong>Newsletter</strong> – informacje handlowe i inne treści marketingowe (oferty, promocje, informacje o nowościach, artykuły i informacje branżowe itp.) udostępnione przez ADO nieodpłatnie Użytkownikowi na podany przez niego adres e‑mail, za uprzednio wyrażoną przez niego zgodą na przetwarzanie Danych Osobowych.
                    </li>
                    <li>
                        <strong>Pliki Cookies</strong> (tzw. „ciasteczka”) – pliki tekstowe, w których serwery Serwisu zapisują informacje na dysku twardym komputera или urządzenia mobilnego, z którego korzysta Użytkownik. Informacje zapisane w pliku „ciasteczka”, serwer Serwisu może odczytać przy ponownym połączeniu się z tego urządzenia, lecz mogą być one odczytywane również przez inne serwery lub innych użytkowników Internetu.
                    </li>
                    <li>
                        <strong>RODO</strong> – Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych).
                    </li>
                    <li>
                        <strong>UODO</strong> – Ustawa o ochronie danych osobowych z dnia 10 maja 2018 r. (Dz. U. 2018 poz. 1000 ze zm.).
                    </li>
                    <li>
                        <strong>Dane Osobowe/Dane</strong> – wszelkie informacje o zidentyfikowanej lub możliwej do zidentyfikowania osobie fizycznej.
                    </li>
                    <li>
                        <strong>Polityka Prywatności</strong> – niniejsza polityka prywatności Serwisu udostępniona w zakładce pn. „Polityka Prywatności”, pod adresem: <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityka Prywatności</a>.
                    </li>
                </ol>

                {/* II. Postanowienia ogólne */}
                <p className='my-2'><strong>II. Postanowienia ogólne.</strong></p>
                <ol>
                    <li>ADO dokłada wszelkich starań, aby chronić prywatność osób korzystających z Serwisu. ADO dba o to, by dane osobowe Użytkowników Serwisu pozostawały należycie chronione i w tym celu zapewnia odpowiednie środki techniczne i organizacyjne gwarantujące bezpieczeństwo Danych Osobowych udostępnionych przez Użytkowników w Serwisie, w szczególności uniemożliwiające nieuprawniony dostęp do tych Danych osobom trzecim lub ich przetwarzanie z naruszeniem przepisów prawa, zapobiegając jednocześnie ich utracie, uszkodzeniu lub zniszczeniu.</li>
                    <li>Niniejsza Polityka Prywatności powstała w celu realizacji zasady zgodnego z prawem, rzetelnego i przejrzystego przetwarzania Danych Osobowych w trakcie korzystania z Serwisu.</li>
                    <li>W przypadku pytań związanych z ochroną Danych Osobowych w Serwisie prosimy o kontakt pod adresem: <a href="mailto:iod@seniornaplus.pl" className="text-coral underline hover:no-underline">iod@seniornaplus.pl</a>.</li>
                </ol>

                {/* III. Jakie Dane zbieramy i w jakim celu */}
                <p className='my-2'><strong>III. Jakie Dane zbieramy i w jakim celu.</strong></p>
                <ol>
                    <li>Dane przetwarzane w ramach świadczenia usług w Serwisie www.seniornaplus.pl pobierane są od Kandydatów, a także innych Użytkowników Serwisu.</li>
                    <li>
                        ADO będzie przetwarzać następujące Dane Osobowe:
                        <ol className='ml-10'>
                            <li>Dane identyfikujące (np. imię, nazwisko),</li>
                            <li>Dane kontaktowe (np. adres e‑mail, numer telefonu),</li>
                            <li>Dane dotyczące wykształcenia, wykonywanego zawodu, znajomości języka obcego, doświadczenia zawodowego, kwalifikacji zawodowych i dodatkowych umiejętności (m.in. kurs pierwszej pomocy czy prawo jazdy), preferencje dotyczące zatrudnienia (w tym oczekiwania finansowe) oraz referencje od poprzednich pracodawców,</li>
                            <li>Dane dotyczące aktywności, działań i sesji Użytkowników w Serwisie,</li>
                            <li>Dane o urządzeniach oraz systemie operacyjnym Użytkownika,</li>
                            <li>Dane z przeglądarki internetowej Użytkownika,</li>
                            <li>Dane dotyczące lokalizacji oraz numeru IP Użytkownika,</li>
                            <li>Dane zawarte w treści wiadomości w Formularzu Kontaktowym.</li>
                        </ol>
                    </li>
                    <li>
                        Dane Osobowe będą przetwarzane w celu:
                        <ol className='ml-10'>
                            <li>zawarcia, wykonania i monitorowania wykonywania umowy o świadczenie usług elektronicznych – przez okres poprzedzający zawarcie umowy oraz przez okres wykonywania umowy (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. b) RODO – przetwarzanie jest niezbędne do wykonania umowy);</li>
                            <li>niezbędnym dla wykonania obowiązków prawnych, w szczególności przepisów podatkowych, przepisów o rachunkowości – przez okres wynikający z tych przepisów (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. c) RODO – wykonanie obowiązku nałożonego przepisami prawa);</li>
                            <li>ewentualnego ustalenia i dochodzenia roszczeń lub obrony przed roszczeniami, w tym sprzedaży wierzytelności – przez czas trwania postępowań i okres przedawnienia potencjalnych roszczeń (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. f) RODO – realizacja prawnie uzasadnionego interesu ADO w postaci dochodzenia roszczeń i obrony przed roszczeniami związanymi z umową);</li>
                            <li>proponowania Ofert Pracy oraz dla potrzeb niezbędnych do udziału w procesach rekrutacji przez okres do odwołania zgody (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO – osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów),</li>
                            <li>marketingu bezpośredniego usług i produktów własnych – przez okres do czasu wniesienia sprzeciwu przez Użytkownika (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. f) RODO – realizacja prawnie uzasadnionego interesu ADO lub prawnie uzasadniony interes w związku z przepisami ustawy z dnia 12 lipca 2024 r. Prawo komunikacji elektronicznej);</li>
                            <li>prowadzenia innych działań marketingowych niż określone w pkt. 5 powyżej – przez okres do odwołania zgody przez Użytkownika (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO – osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów),</li>
                            <li>realizacji zapytania przez Formularz Kontaktowy przez okres do odwołania zgody lub zakończenia obsługi zapytania (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO – osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów),</li>
                            <li>w celu zapewnienia funkcjonowania i dostępu Serwisu Użytkownikom (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO – osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów).</li>
                        </ol>
                    </li>
                    <li>Pozyskanie lub podanie Danych Osobowych jest dobrowolne i jest warunkiem niezbędnym do korzystania z funkcjonalności Serwisu (np. Formularz Kontaktowy, przechowywanie niektórych Plików Cookies), a także do realizacji umowy o świadczenie usług drogą elektroniczną lub podjęcia działań przed zawarciem umowy. W przypadku niepodania Danych Osobowych nie będzie możliwa realizacja umowy lub podjęcie działań przed zawarciem umowy. Brak zgody na przetwarzanie Danych może również wpłynąć negatywnie na niektóre funkcjonalności dostępne na stronach internetowych Serwisu (np. brak udzielenia odpowiedzi na zapytanie przez Formularz Kontaktowy, brak funkcjonalności Serwisu z uwagi na usunięcie niektórych Plików Cookies).</li>
                </ol>

                {/* IV. Formularze i Newsletter */}
                <p className='my-2'><strong>IV. Wypełnienie Formularza Rekrutacyjnego, Formularza Kontaktowego oraz zapis na Newsletter.</strong></p>
                <ol>
                    <li>ADO świadczy usługę polegającą na zbieraniu aplikacji Kandydatów chętnych do podjęcia pracy u ADO za pośrednictwem Formularza Rekrutacyjnego.</li>
                    <li>Korzystając z Formularza Rekrutacyjnego Kandydat wyraża zgodę na przetwarzanie swoich Danych Osobowych w celu zaproponowania mu przez ADO Ofert Pracy oraz dla potrzeb niezbędnych do udziału w prowadzonych przez ADO procesach rekrutacji (art. 6 ust. 1 lit. a) RODO). Prawidłowe wypełnienie Formularza Aplikacyjnego oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja <a href="/terms-of-use" className="text-coral underline hover:no-underline">Warunków Korzystania z Serwisu</a> oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a> są niezbędne do prawidłowego wysłania aplikacji.</li>
                    <li>Żądanie usunięcia Danych podanych przy wypełnianiu Formularza Rekrutacyjnego oznacza rezygnację z dalszego udziału w procesach rekrutacyjnych i spowoduje niezwłoczne usunięcie Danych Kandydata z Serwisu.</li>
                    <li>ADO świadczy usługę polegającą na możliwości skierowania zapytania do Serwisu za pośrednictwem Formularza Kontaktowego.</li>
                    <li>Korzystając z Formularza Kontaktowego Użytkownik wyraża zgodę na przetwarzanie swoich Danych Osobowych w celu udzielenia odpowiedzi na zapytanie (art. 6 ust. 1 lit. a) RODO). Prawidłowe wypełnienie Formularza Kontaktowego oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja <a href="/terms-of-use" className="text-coral underline hover:no-underline">Warunków Korzystania z Serwisu</a> oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a> są niezbędne do prawidłowego wysłania zapytania.</li>
                    <li>Żądanie usunięcia Danych podanych przy wypełnianiu Formularza Kontaktowego oznacza rezygnację z zapytania do Serwisu i spowoduje niezwłoczne usunięcie danych Użytkownika z Serwisu.</li>
                    <li>ADO świadczy usługę polegającą na przesyłaniu Newsletteru. W ramach Newsletteru ADO udostępnia nieodpłatnie Użytkownikom informacje na różne tematy powiązane z branżą HR (branżą pracowniczą, rynkiem pracy, zarówno w ujęciu krajowym jak i globalnym) oraz treści o tematyce lifestylowej. Informacje te, mimo iż są starannie przygotowywane przez zespół profesjonalistów z branży, mają charakter edukacyjny, niewiążący i ogólny. Nie stanowią i nie mogą zastąpić indywidualnej porady, w szczególności prawnej ani medycznej. W związku z tym ADO nie ponosi odpowiedzialności za dokładność, rzetelność lub kompletność poszczególnych treści. Ponadto, treści zawarte w Newsletterze mogą mieć charakter marketingowy.</li>
                    <li>Korzystając z zapisu na Newsletter Użytkownik wyraża zgodę na przetwarzanie swoich Danych Osobowych w celu otrzymywania informacji handlowych i innych treści marketingowych (art. 6 ust. 1 lit. a) RODO). Prawidłowe wypełnienie zapisu na Newsletter oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja <a href="/terms-of-use" className="text-coral underline hover:no-underline">Warunków Korzystania z Serwisu</a> oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a> są niezbędne do rozpoczęcia świadczenia usługi wysyłania Newsletteru.</li>
                    <li>Żądanie usunięcia Danych podanych przy wypełnianiu zapisu na Newsletter oznacza rezygnację z jego otrzymywania i spowoduje niezwłoczne usunięcie Danych Użytkownika z Serwisu.</li>
                </ol>

                {/* V. Udostępnianie Danych */}
                <p className='my-2'><strong>V. Udostępnianie Danych Osobowych.</strong></p>
                <ol>
                    <li>
                        Odbiorcami Danych Osobowych Użytkownika mogą być:
                        <ol className='ml-10'>
                            <li>dostawcy systemów informatycznych oraz usług IT;</li>
                            <li>podmioty świadczące na rzecz ADO usługi księgowe, badania jakości obsługi, dochodzenia należności, usługi prawne, analityczne, marketingowe;</li>
                            <li>operatorzy pocztowi i kurierzy;</li>
                            <li>operatorzy systemów płatności elektronicznych oraz banki w zakresie realizacji płatności;</li>
                            <li>podmioty, które nabywają wierzytelności i podmioty windykacyjne – w razie braku wykonania przez Użytkownika zobowiązań na podstawie umowy o świadczenie usług elektronicznych;</li>
                            <li>podwykonawcy, współpracownicy i klienci ADO, czyli podmioty, które wykonują za ADO lub we współpracy z nim usługę lub korzystają z usług świadczonych przez ADO, z których realizacją związana jest umowa,</li>
                            <li>operatorzy portali społecznościowych i serwisów internetowych o których mowa w rozdziale XII niniejszej Polityki Prywatności;</li>
                            <li>organy uprawnione do otrzymania Danych Osobowych na podstawie przepisów prawa.</li>
                        </ol>
                    </li>
                    <li>
                        Dane Użytkowników mogą być przekazywane do państw trzecich tj. Wielka Brytania czy Stany Zjednoczone Ameryki. Przekazanie Danych Osobowych do Wielkiej Brytanii jest możliwe z uwagi na fakt, iż 28 czerwca 2021 r. Komisja Europejska stwierdziła w dwóch decyzjach wykonawczych, iż Zjednoczone Królestwo Wielkiej Brytanii i Irlandii Północnej zapewnia odpowiedni poziom ochrony Danych Osobowych równoważny z poziomem gwarantowanym na mocy RODO (decyzje KE nr C(2021) 4800 final oraz C(2021) 4801 final). Przekazanie Danych Osobowych do Stanów Zjednoczonych Ameryki jest możliwe z uwagi na fakt, iż 10 lipca 2023 r. Komisja Europejska przyjęła nową decyzję wykonawczą stwierdzającą odpowiedni stopień ochrony danych osobowych zapewniony przez tzw. "Ramy ochrony danych UE‑USA” (EU‑US Data Privacy Framework – decyzje KE 2023/1795 – notyfikowana jako dokument nr C(2023) 4745).
                    </li>
                </ol>

                {/* VI. Okres przechowywania */}
                <p className='my-2'><strong>VI. Okres przechowywania Danych Osobowych.</strong></p>
                <ol>
                    <li>Dane Osobowe Kandydatów, którzy wysłali aplikację przez Formularz Rekrutacyjny będą przetwarzane przez okres proponowania Ofert Pracy oraz trwania procesów rekrutacyjnych, aż do odwołania zgody.</li>
                    <li>Dane osobowe Użytkowników Serwisu, którzy wysłali zapytanie za pośrednictwem Formularza Kontaktowego, są przechowywane przez czas przetwarzania zapytania, aż do udzielenia odpowiedzi.</li>
                    <li>Dane osobowe Użytkowników Serwisu, którzy zapisali się na Newsletter, są przechowywane przez czas trwania usługi, aż do odwołania zgody.</li>
                    <li>Dane osobowe wszystkich Użytkowników Serwisu są przechowywane przez czas odpowiadający cyklowi życia zapisanych na ich urządzeniach Plików Cookies lub do momentu zmiany ustawień Plików Cookies w przeglądarce internetowej tego Użytkownika.</li>
                </ol>

                {/* VII. Uprawnienia */}
                <p className='my-2'><strong>VII. Uprawnienia osób których Dane są przetwarzane w Serwisie.</strong></p>
                <ol>
                    <li>
                        Użytkownik, który wyraził zgodę na przetwarzanie jego Danych Osobowych w celu:
                        <ol className='ml-10'>
                            <li>proponowania Ofert Pracy oraz dla potrzeb niezbędnych do udziału w procesach rekrutacji i/lub</li>
                            <li>realizacji zapytania przez Formularz Kontaktowy i/lub</li>
                            <li>w celu prowadzenia działań marketingowych (o których mowa w rozdziale III ust. 3 pkt. 6 powyżej) i/lub</li>
                            <li>zapewnienia funkcjonowania i dostępu Serwisu,</li>
                        </ol>
                        ma prawo do cofnięcia zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem. Cofnięcie zgody nie pociąga za sobą negatywnych konsekwencji, może mieć jednak wpływ na dalsze korzystanie z usług Serwisu, które zgodnie z prawem ADO świadczy na podstawie zgody (podstawa prawna – art. 7 ust. 3 RODO).
                    </li>
                    <li>Użytkownik, którego Dane Osobowe przetwarzane są w celu marketingu bezpośredniego usług i produktów własnych ADO (rozdział III ust. 3 pkt. 5 powyżej) ma prawo do wniesienia sprzeciwu w dowolnym momencie, bez podania przyczyny. Jeśli sprzeciw okaże się zasadny, wówczas ADO usuwa dane, wobec których został zgłoszony sprzeciw (podstawa prawna – art. 21 RODO).</li>
                    <li>
                        Użytkownik ma również prawo:
                        <ol className='ml-10'>
                            <li>
                                dostępu do swoich Danych Osobowych oraz otrzymania ich kopii – Użytkownik ma prawo do uzyskania potwierdzenia odnośnie przetwarzanych Danych, a także do uzyskania:
                                <ol className='ml-10'>
                                    <li>dostępu do swoich Danych Osobowych;</li>
                                    <li>informacji o celach przetwarzania, kategoriach przetwarzanych Danych Osobowych, ich odbiorcach lub kategoriach odbiorców, a także planowanym okresie przechowywania (lub kryteriach decydujących o okresie przechowywania).</li>
                                    <li>informacji o prawach przysługujących na podstawie RODO oraz prawie do wniesienia skargi do organu nadzorczego, źródle danych, zautomatyzowanym podejmowaniu decyzji (w tym profilowaniu);</li>
                                    <li>informacji o zabezpieczeniach stosowanych w związku z przekazywaniem danych poza Unię Europejską.</li>
                                    <li>kopii swoich Danych Osobowych (podstawa prawna – art. 15 RODO).</li>
                                </ol>
                            </li>
                            <li>sprostowania (poprawiania) swoich Danych Osobowych – Użytkownik ma prawo do sprostowania i uzupełnienia swoich Danych Osobowych (podstawa prawna – art. 16 RODO).</li>
                            <li>
                                ograniczenia przetwarzania Danych Osobowych – zgłoszenie takie może wiązać się z ograniczeniem możliwości korzystania z usług Serwisu, do których wymagane jest przetwarzanie określonych kategorii Danych Osobowych, a także z przerwaniem wysyłania komunikatów marketingowych; Użytkownik ma prawo do żądania ograniczenia wykorzystywania Danych Osobowych w przypadku:
                                <ol className='ml-10'>
                                    <li>kwestionowania prawidłowości Danych Osobowych przez Użytkownik – wiąże się z ograniczeniem wykorzystywania Danych przez okres nie dłuższy niż 7 dni;</li>
                                    <li>niezgodnego z prawem przetwarzania Danych Osobowych Użytkownika;</li>
                                    <li>w sytuacji, gdy Dane Osobowe Użytkownika nie są już niezbędne do celów, w których zostały zebrane lub wykorzystywane, jednak są potrzebne Użytkownikowi, w celu ustalenia dochodzenia lub obrony roszczeń;</li>
                                    <li>w sytuacji wniesienia sprzeciwu wobec wykorzystywania Danych Osobowych – ograniczenie następuje na okres niezbędny do rozważenia, czy ochrona interesów, praw oraz wolności Użytkownika przeważa nad interesami, które są realizowane przez ADO (podstawa prawna – art. 18 RODO).</li>
                                </ol>
                            </li>
                            <li>
                                usunięcia Danych Osobowych – tzw. „prawo do bycia zapomnianym” – Użytkownik ma prawo do żądania usunięcia wszystkich lub niektórych Danych Osobowych przetwarzanych przez ADO; prawo do bycia zapomnianym przysługuje w następujących przypadkach:
                                <ol className='ml-10'>
                                    <li>wycofanie przez Użytkownika określonej zgody, w zakresie przetwarzania Danych opartych na uprzedniej zgodzie;</li>
                                    <li>Dane Osobowe przestały być niezbędne do celów, w których zostały zebrane lub przetwarzane;</li>
                                    <li>Użytkownik wniósł sprzeciw wobec wykorzystywania jego Danych w celach marketingowych, statystycznych lub badania satysfakcji;</li>
                                    <li>Dane Osobowe Użytkownika są przetwarzane niezgodnie z prawem.</li>
                                </ol>
                            </li>
                            <li>przenoszenia Danych Osobowych – Użytkownik ma prawo otrzymać Dane Osobowe, które dostarczył, a następnie przesłać je do innego, wybranego przez siebie Administratora Danych Osobowych; Użytkownik ma również prawo żądać, aby Dane Osobowe zostały przesłane bezpośrednio innemu Administratorowi, o ile jest to technicznie możliwe; ADO będący w posiadaniu Danych Osobowych Użytkownika prześle dane w postaci ogólnie znanego i możliwego do odtworzenia formatu pliku (np. .doc, .xls) (podstawa prawna – art. 20 RODO).</li>
                            <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
                            <li>wniesienia sprzeciwu – z przyczyn związanych ze szczególną sytuacją; Użytkownikowi przysługuje prawo wniesienia sprzeciwu wobec przetwarzania, które dokonywane jest przez ADO z uwagi na jego niezbędność dla realizacji prawnie uzasadnionych interesów ADO.</li>
                        </ol>
                    </li>
                    <li>
                        Pomimo żądania usunięcia Danych Osobowych, w związku z wniesieniem sprzeciwu lub wycofaniem zgody, ADO może zachować Dane Osobowe, które są niezbędne do celów ustalenia, dochodzenia lub obrony roszczeń, w szczególności:
                        <ol className='ml-10'>
                            <li>imię i nazwisko,</li>
                            <li>adres mailowy, adres do korespondencji lub adres do doręczeń,</li>
                            <li>historię aplikacji/historię aktywności w Serwisie (podstawa prawna art. 17 RODO).</li>
                        </ol>
                    </li>
                    <li>
                        Żądania Użytkownika wynikające z powyższych praw są realizowane w następujących przedziałach czasowych:
                        <ol className='ml-10'>
                            <li>niezwłocznie po otrzymaniu zgłoszenia, jednak w czasie nie dłuższym niż miesiąc,</li>
                            <li>w przypadku skomplikowanych żądań lub większej liczby żądań ADO zastrzega sobie możliwość realizacji żądania w czasie do 2 miesięcy, uprzednio informując o tym fakcie Użytkownika,</li>
                            <li>aktualizacja wprowadzonych w systemach informatycznych żądań może wynosić do 48 godzin.</li>
                        </ol>
                    </li>
                </ol>

                {/* VIII. Skargi, wnioski */}
                <p className='my-2'><strong>VIII. Skargi, wnioski.</strong></p>
                <ol>
                    <li>Użytkownik ma możliwość zgłaszania skarg, wniosków oraz zapytań dotyczących przetwarzania Danych Osobowych, a także realizacji przysługujących mu praw.</li>
                    <li>Użytkownik ma również prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych w przypadku naruszenia praw do ochrony Danych Osobowych, a także innych praw przysługujących Użytkownikowi na podstawie RODO i UODO.</li>
                    <li>W ramach rozpatrywania skarg i wniosków, ADO może przetwarzać Dane podane przez Użytkownika w Serwisie lub w ramach zgłoszenia drogą mailową, będących przyczyną skarg lub wniosków, jak również dokumentach załączonych do skargi lub wniosku. Podstawą prawną do przetwarzania powyższych danych jest uzasadniony interes ADO, dotyczący poprawnej funkcjonalności usług świadczonych drogą elektroniczną oraz na budowaniu pozytywnych relacji z Użytkownikami, opartymi na rzetelności i lojalności (art. 6 ust. 1 lit. f) RODO).</li>
                    <li>W celu ustalenia, dochodzenia oraz egzekwowania roszczeń, ADO może przetwarzać Dane Osobowe Kandydata lub innego Użytkownika, w szczególności takie jak: imię i nazwisko, adres, adres mailowy oraz inne podane przez nich Dane, niezbędne do udowodnienia istnienia roszczenia, w tym rozmiarów poniesionej szkody. Podstawą prawną do przetwarzania ww. Danych jest prawnie uzasadniony interes ADO związany z ustalenia, dochodzeniem oraz egzekwowaniem roszczeń oraz obronie przed roszczeniami w postępowaniu przed sądami i organami państwowymi (art. 6 ust. 1 lit. f) RODO).</li>
                </ol>

                {/* IX. Odpowiedzialność ADO */}
                <p className='my-2'><strong>IX. Odpowiedzialność ADO.</strong></p>
                <ol>
                    <li>
                        ADO nie ponosi odpowiedzialności za:
                        <ol className='ml-10'>
                            <li>treści znajdujące się na stronach internetowych niebędących własnością ADO, do których linki mogą znajdować się w ww. treściach np. odesłanie do strony podmiotu trzeciego;</li>
                            <li>utratę przez Użytkownika Danych Osobowych spowodowaną działaniem czynników zewnętrznych (np. brak prądu) lub innych okoliczności niezależnych od ADO (w tym działanie osób trzecich).</li>
                            <li>podanie przez Użytkownika, w szczególności Kandydata nieprawdziwych lub niepełnych danych lub informacji, w tym podanie ich w Formularzu Rejestracyjnym lub Formularzu Kontaktowym.</li>
                        </ol>
                    </li>
                    <li>Administrator Danych Osobowych może powierzyć przetwarzanie Danych Osobowych innemu podmiotowi w drodze umowy powierzenia danych zgodnie z RODO oraz UODO.</li>
                    <li>ADO nie ponosi odpowiedzialności za jakiekolwiek działania osób trzecich, mające związek z treścią lub zakresem Danych Osobowych Użytkownika oraz za szkody powstałe w ich następstwie.</li>
                </ol>

                {/* X. Polityka Cookies */}
                <p className='my-2'><strong>X. Polityka Cookies.</strong></p>
                <ol>
                    <li>Pliki Cookies (tzw. „ciasteczka”) stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika i przeznaczone są do korzystania ze stron internetowych Serwisu.</li>
                    <li>
                        Pliki Cookies zawierają:
                        <ol className='ml-10'>
                            <li>nazwę strony internetowej, z której pochodzą;</li>
                            <li>czas przechowywania ich na urządzeniu końcowym;</li>
                            <li>unikalny numer.</li>
                        </ol>
                    </li>
                    <li>Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika Pliki Cookies oraz uzyskującym do nich dostęp jest ADO, a także inne podmioty upoważnione, współtworzące Serwis.</li>
                    <li>Pliki Cookies stosowane w Serwisie wykorzystywane są w celu dostosowania zawartości stron internetowych Serwisu do preferencji Użytkownika, w szczególności pliki te pozwalają rozpoznać urządzenie Użytkownika Serwisu i odpowiednio wyświetlić stronę internetową, dostosowaną do jego indywidualnych potrzeb, a także dla tworzenia statystyk umożliwiających poznanie sposobu korzystania z Serwisu, stanowiąc bazę do ulepszanie jego struktury i zawartości.</li>
                    <li>W wielu przypadkach oprogramowanie służące do przeglądania stron internetowych (przeglądarka internetowa) domyślnie dopuszcza przechowywanie Plików Cookies w urządzeniu końcowym Użytkownika. Użytkownicy mogą dokonać w każdym czasie zmiany ustawień dotyczących Plików Cookies. Ustawienia te mogą zostać zmienione w szczególności w taki sposób, aby blokować automatyczną obsługę Plików Cookies w ustawieniach przeglądarki internetowej, bądź informować o ich każdorazowym zamieszczeniu w urządzeniu Użytkownika. Szczegółowe informacje o możliwości i sposobach obsługi Plików Cookies dostępne są w ustawieniach przeglądarki z której korzysta Użytkownik.</li>
                    <li>Pliki Cookies mają swój okres przechowywania, po upływie którego wygasają.</li>
                    <li>
                        Serwis wykorzystuje następujące rodzaje Plików Cookies:
                        <ol className='ml-10'>
                            <li>pliki sesyjne tj. pliki tymczasowe – przechowywane w urządzeniu Użytkownika do czasu wylogowania się z Serwisu, opuszczenia strony lub wyłączenia przeglądarki internetowej oraz</li>
                            <li>pliki stałe – przechowywane przez określony czas w parametrach Plików Cookies lub do czasu ich usunięcia przez Użytkownik.</li>
                        </ol>
                    </li>
                    <li>
                        W ramach Serwisu stosowane są następujące Pliki Cookies:
                        <ol className='ml-10'>
                            <li>niezbędne Pliki Cookies – konieczne do funkcjonowania Serwisu, używane zazwyczaj w odpowiedzi na działania podejmowane przez Użytkownika, np. ustawienie opcji prywatności;</li>
                            <li>funkcjonalne Pliki Cookies – umożliwiające zapisanie ustawień wybranych przez Użytkownika np. wybór języka;</li>
                            <li>statystyczne – umożliwiające przechowywanie techniczne lub dostęp, który jest używany wyłącznie do anonimowych celów statystycznych;</li>
                            <li>marketingowe Pliki Cookies – stosowane są w celu śledzenia Użytkowników, celem wyświetlania reklam, które mogą być dla nich istotne i interesujące.</li>
                        </ol>
                    </li>
                    <li>
                        Użycie Plików Cookies innych niż niezbędne wymaga uprzedniej zgody Użytkownika. Udzielenie zgody jest dobrowolne. Użytkownik może w każdym czasie zmienić lub wycofać wyrażoną zgodę lub zmodyfikować swoją decyzję dotyczącą Plików Cookies poprzez zmiany w ustawieniach przeglądarki, np.:
                        <ol className='ml-10'>
                            <li>Internet Explorer – Menu → Narzędzia → Opcje Internetowe → Prywatność → Suwak ustawiający poziom → OK.</li>
                            <li>Mozilla Firefox – Menu → Narzędzia → Opcje → Prywatność → Zaznacz/Odznacz Akceptuj ciasteczka.</li>
                            <li>Google Chrome – Menu → Ustawienia → Ustawienia zaawansowane → Prywatność → Ustawienia treści → Pliki cookies → Zaznacz/Odznacz Usuwanie plików cookies/Domyślne blokowanie plików cookies/Domyślne zezwalanie na pliki cookies/Domyślne zachowywanie plików cookies i danych stron do zamknięcia przeglądarki.</li>
                            <li>Opera – Menu → Narzędzie → Preferencje → Zaawansowane → Zaznacz/Odznacz Ciasteczka.</li>
                        </ol>
                    </li>
                    <li>Użytkownik odwiedzający Serwis po raz pierwszy (lub po usunięciu przez niego Plików Cookies na urządzeniu) zobaczy zapytanie o zgodę na użycie Plików Cookies. Użytkownik może wyrazić zgodę na użycie Plików Cookies, ograniczyć użycie poszczególnych kategorii Plików Cookies lub całkowicie wyłączyć użycie Plików Cookies innych niż niezbędne, poprzez kliknięcie odpowiedniego przycisku.</li>
                    <li>ADO informuje, że ograniczenia stosowania Plików Cookies mogą wpłynąć na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.</li>
                </ol>

                {/* XI. Działania Marketingowe */}
                <p className='my-2'><strong>XI. Działania Marketingowe</strong></p>
                <ol>
                    <li>Informujemy, że Serwis może wykorzystywać narzędzia Google Analytics i Google Remarketing – usługi analizy oglądalności stron internetowych udostępnianych przez firmę Google LLC 1600 Amphitheatre Parkway, Mountain View, California 94043, USA (zwaną dalej „Google”).</li>
                    <li>Usługi Google, o których mowa powyżej, korzystają z Plików Cookies, tj. plików tekstowych, przechowywanych na komputerze Użytkownika i umożliwiających analizę korzystania ze strony internetowej (w tym przypadku z Serwisu). Informacje wygenerowane przez Pliki Cookies na temat korzystania z Serwisu przez Użytkownika (łącznie z jego adresem IP) transmitowane są do serwera Google w Stanach Zjednoczonych i tam przechowywane. Google korzysta z przechowywanych informacji w celu oceny korzystania z Serwisu przez Użytkownika, tworzenia raportów dotyczących ruchu w Serwisie dla ADO oraz świadczenia dalszych usług internetowych, związanych z korzystaniem przez Użytkowników z Serwisu.</li>
                    <li>Google może przekazywać zebrane informacje o Użytkownikach osobom trzecim, w przypadku wymagań prawnych lub w zakresie koniecznym do przetwarzania danych przez osoby trzecie na zlecenie Google. Jednak w żadnym przypadku nie następuje identyfikacja adresów IP z innymi danymi Użytkowników, będącymi w posiadaniu Google.</li>
                    <li>Użytkownik może zrezygnować z Plików Cookies Google, wybierając odpowiednie ustawienia w swojej przeglądarce, uwzględniając przy tym ewentualną niemożliwość korzystania ze wszystkich funkcji Serwisu. Korzystanie z usług Serwisu jest równoznaczne z wyrażeniem zgody na przetwarzanie danych osobowych przez Google w sposób opisany powyżej i do wyżej wymienionych celów. Udzieloną zgodę można w każdej chwili wycofać ze skutkiem na przyszłość poprzez dokonanie dezaktywacji rozszerzenia do przeglądarki Google Analytics. Dla Państwa wygody zamieszczamy link do narzędzia wyłączającego tzw. add‑on: – <a href="http://tools.google.com/dlpage/gaoptout?hl=pl" className="text-coral underline hover:no-underline">http://tools.google.com/dlpage/gaoptout?hl=pl</a>.</li>
                    <li>Informujemy, że Serwis korzysta z Google Analytics z rozszerzeniem „_anonymizeIp()“, co sprawia, że wszystkie adresy IP zapisywane i przetwarzane są wyłącznie w formie skróconej. Bezpośrednie połączenie z danym Użytkownikiem jest więc wykluczone.</li>
                    <li>Funkcja remarketingu w Google Analytics umożliwia uzyskanie informacji o preferencjach Użytkowników na podstawie odwiedzonych stron i w ten sposób analizowana jest skuteczność reklamy, wyświetlanej na stronach internetowych przez osoby trzecie oraz Google. Za pomocą przechowywanych w tym celu Plików Cookies, Google a także inni usługodawcy mogą, sugerując się poprzednimi wizytami Użytkowników na stronach, wyświetlać boksy reklamowe.</li>
                    <li>Google Analytics stosowany jest dodatkowo do analizowania danych z programu Google AdWords oraz Plików Cookies Double‑Click do celów statystycznych i dokładniejszego dopasowania wyświetlanych reklam do profilu Użytkownika.</li>
                    <li>Jeśli opisana funkcja nie jest przez Użytkownika akceptowana, może zostać w każdej chwili dezaktywowana na stronie: <a href="https://adssettings.google.com/authenticated" className="text-coral underline hover:no-underline">https://adssettings.google.com/authenticated</a>.</li>
                    <li>Pliki Cookies typu DoubleClick to pliki, które nadają przeglądarce anonimowy numer identyfikacyjny (ID), służący do rejestracji reklam, które pojawiły się w poszczególnych przeglądarkach oraz zapisu ich oglądalności. Pliki te nie zawierają informacji umożliwiających identyfikację konkretnej osoby. Stosowanie Plików Cookies DoubleClick ma na celu jedynie wyświetlanie Użytkownikowi reklam, zgodnych z jego zainteresowaniami, domniemanymi na podstawie poprzednich wizyt w Serwisie. Wszystkie informacje generowane przez Pliki Cookies przekazywane są przez Google do
                        analizy na serwer w Stanach Zjednoczonych i tam przechowywane.</li>
                    <li>W ramach funkcji Google AdWords na komputerze Użytkownika zapisywane są Pliki Cookies. Następuje to natychmiast po kliknięciu na ogłoszenie opublikowane przez Google. Funkcja ta nie służy identyfikacji Użytkownika, lecz jedynie identyfikacji boksu reklamowego, przez który Użytkownik dotarł do danej strony. Każdy klient Google AdWords, w tym ADO, otrzymuje inne Pliki Cookies, co uniemożliwia śledzenie Użytkowników za pośrednictwem stron internetowych. Pozyskane w ten sposób informacje przeznaczone są jedynie do celów statystycznych. Klienci Google AdWords, w tym ADO, nie otrzymują żadnych informacji służących do identyfikacji Użytkowników.</li>
                    <li>Dokładne informacje na temat warunków korzystania z usług Google i ochrony danych znaleźć można na: <a href="http://www.google.com/analytics/terms/de.html" className="text-coral underline hover:no-underline">http://www.google.com/analytics/terms/de.html</a> albo na <a href="https://www.google.pl/intl/pl/policies/" className="text-coral underline hover:no-underline">https://www.google.pl/intl/pl/policies/</a>.</li>
                </ol>

                {/* XII. Profile / wtyczki */}
                <p className='my-2'><strong>XII. Profile Serwisu w mediach społecznościowych i serwisach internetowych – tzw. „wtyczki” społecznościowe.</strong></p>
                <ol>
                    <li>W Serwisie zastosowano tzw. „wtyczki” społecznościowe powodujące przekierowanie do profili ADO m.in. na portalu społecznościowym Facebook.</li>
                    <li>Przy korzystaniu z wtyczek społecznościowych znajdujących się w Serwisie dochodzi do wymiany danych pomiędzy Użytkownikiem, a portalem społecznościowym bądź serwisem internetowym.</li>
                    <li>ADO nie przetwarza danych o których mowa w ust. 2 powyżej oraz nie posiada wiedzy, jakie dane Użytkowników są gromadzone przez portale określone w ust. 1. Informacje na ten temat powinny znajdować się w polityce prywatności lub regulaminie danego serwisu społecznościowego lub internetowego.</li>
                    <li>ADO prowadząc profil firmowy Serwisu na portalach bądź w serwisach, o których mowa w ust. 1, przetwarza Dane Osobowe użytkowników odwiedzających, obserwujących lub komentujących te profile, bądź w inny sposób wchodzących w interakcję z danym profilem Serwisu w mediach społecznościowych.</li>
                    <li>W związku z prowadzeniem profili Serwisu w mediach społecznościowych, przetwarzane są Dane Osobowe podane przez użytkownika portalu społecznościowego oraz Dane pozyskane od operatora serwisów społecznościowych lub internetowych, w tym Dane obejmujące imię i nazwisko, nazwę, identyfikator użytkownika lub ewentualnie treść komentarzy.</li>
                    <li>
                        Dane Osobowe określone w ust. 5 przetwarzane są w celach, których realizacja stanowi prawnie uzasadniony interes ADO (art. 6 ust. 1 lit. f) RODO), w tym do:
                        <ol className='ml-10'>
                            <li>prowadzenia profili Serwisu w serwisach społecznościowych lub internetowych na zasadach określonych przez operatorów tych serwisów;</li>
                            <li>informowania za pośrednictwem profilu Serwisu o jego działalności, w tym m.in. o promocjach, konkursach, Ofertach Pracy lub Ofertach Przewozu, Grach, artykułach branżowych itp.;</li>
                            <li>budowania i wzmacniania relacji z potencjalnymi i obecnymi klientami, partnerami, w szczególności Pracodawcami, Przewoźnikami oraz Kandydatami, poprzez komunikację z nimi za pośrednictwem dostępnych funkcjonalności;</li>
                            <li>analizy i prowadzenia statystyk dotyczących funkcjonowania, popularności oraz sposobu korzystania z profili Serwisu przez użytkowników serwisu społecznościowego lub internetowego;</li>
                            <li>analizy i udzielania odpowiedzi na komentarze publikowane przez użytkowników serwisu społecznościowego lub internetowego;</li>
                            <li>ustalenia, dochodzenia oraz obrony przed ewentualnymi roszczeniami dotyczącymi korzystania z profilu Serwisu na portalu społecznościowym lub w serwisie internetowym.</li>
                        </ol>
                    </li>
                    <li>Podanie Danych Osobowych przez użytkownika serwisu społecznościowego lub internetowego w ramach profilu Serwisu jest dobrowolne, niemniej ich niepodanie może skutkować niemożnością pełnego korzystania z funkcjonalności profilu Serwisu na portalu społecznościowym lub w serwisie internetowym.</li>
                </ol>

                {/* XIII. Postanowienia końcowe */}
                <p className='my-2'><strong>XIII. Postanowienia końcowe</strong></p>
                <ol>
                    <li>Niniejsza Polityka Prywatności będzie zmieniana w miarę potrzeb i zmian w przepisach powszechnie obowiązującego prawa.</li>
                    <li>O wszelkich istotnych zmianach w Polityce Prywatności ADO, informuje Użytkowników przez publikację odpowiedniej informacji w Serwisie.</li>
                    <li>Polityka Prywatności jest dokumentem zgodnym z <a href="/terms-of-use" className="text-coral underline hover:no-underline">Warunkami Korzystania z Serwisu</a> oraz przepisami powszechnie obowiązującego prawa.</li>
                </ol>
            </div>
        </AppLayout>
    );
}
