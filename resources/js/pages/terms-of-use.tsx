import React from 'react';
import AppLayout from '@/layouts/app-layout';

const TermsOfService = () => {
    return (
        <AppLayout>
            <div className="mx-auto max-w-4xl px-4 py-10 prose prose-sm sm:prose-base">
                <p className='text-xl mb-5'>Warunki Korzystania z portalu www.seniornaplus.pl</p>

                <section>
                    <p className='my-2'><strong>I. Słowniczek pojęć.</strong></p>
                    <p>Użyte w treści pojęcia oznaczają:</p>

                    <ol>
                        <li><strong>Usługodawca</strong> – spółka Senior na Plus Pflege sp. z o.o. z siedzibą w Warszawie (02-662) przy ul. Świeradowskiej 47, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla m.st. Warszawy w Warszawie, XIII Wydział Gospodarczy Krajowego Rejestru Sądowego pod numerem KRS: 0001155432, posiadająca NIP: 5214105615 oraz REGON: 540911002, o kapitale zakładowym 5.000 zł.</li>

                        <li><strong>Serwis</strong> – należący do Usługodawcy serwis internetowy, dostępny na stronie: <a href="http://www.seniornaplus.pl/" className="text-coral underline hover:no-underline">www.seniornaplus.pl</a>.</li>

                        <li><strong>Usługi</strong> – odpłatne (w oparciu o ustalony przez Usługodawcę cennik) lub nieodpłatne usługi świadczone drogą elektroniczną przez Usługodawcę na rzecz Użytkowników Serwisu w oparciu o niniejsze Warunki Korzystania, np. Usługa wysyłania Newslettera, Usługa wysłania Formularza Rekrutacyjnego czy Usługa wysłania Formularza Kontaktowego.</li>

                        <li><strong>Usługobiorcą/Użytkownik</strong> – każda osoba odwiedzająca Serwis, w szczególności Kandydat.</li>

                        <li><strong>Kandydat</strong> - osoba fizyczna, mającą co najmniej 18 lat i posiadająca pełną zdolność do czynności prawnych, która prawidłowo wypełniła i wysłała Formularz Rekrutacyjny celem złożenia aplikacji i podjęcia pracy u Usługodawcy.</li>

                        <li><strong>Umowa o Świadczenie Usług/Umowa</strong> – umowa pomiędzy Usługodawcą a Usługobiorcą, zawarta z chwilą rozpoczęcia korzystania z Usług Serwisu (odpłatnych lub nieodpłatnych), po uprzednim wyrażeniu niezbędnych zgód na przetwarzanie Danych Osobowych, akceptacji Warunków Korzystania oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a>.</li>

                        <li><strong>Świadczenie Usług Drogą Elektroniczną</strong> – wykonanie Usługi świadczonej bez jednoczesnej obecności stron (na odległość), poprzez przekaz danych na indywidualne żądanie Usługobiorcy, przesyłanej i otrzymywanej za pomocą urządzeń do elektronicznego przetwarzania, włącznie z kompresją cyfrową, i przechowywania danych, która jest w całości nadawana, odbierana lub transmitowana za pomocą sieci telekomunikacyjnej w rozumieniu ustawy z dnia 12 lipca 2024 r. – Prawo komunikacji elektronicznej.</li>

                        <li><strong>Środki Komunikacji Elektronicznej</strong> – rozwiązania techniczne, w tym urządzenia teleinformatyczne i współpracujące z nimi narzędzia programowe, umożliwiające indywidualne porozumiewanie się na odległość przy wykorzystaniu transmisji danych między systemami teleinformatycznym, a w szczególności pocztę elektroniczną.</li>

                        <li><strong>Newsletter</strong> - informacje handlowe i inne treści marketingowe (oferty, promocje, informacje o nowościach, artykuły i informacje branżowe itp.) udostępnione przez Usługodawcę nieodpłatnie Usługobiorcy na podany przez niego adres e-mail, za uprzednio wyrażoną przez Użytkownika zgodą na przetwarzanie Danych Osobowych.</li>

                        <li><strong>Formularz Rekrutacyjny</strong> – udostępniony w Serwisie pod adresem <a href="https://seniornaplus.pl/formularz" className="text-coral underline hover:no-underline">https://seniornaplus.pl/formularz</a> lub na stronie głównej <a href="https://seniornaplus.pl/" className="text-coral underline hover:no-underline">https://seniornaplus.pl/</a> (górna sekcja) formularz służący do złożenia aplikacji w celu podjęcia pracy u Usługodawcy. Prawidłowe wypełnienie Formularza Rekrutacyjnego oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja Warunków Korzystania z Serwisu oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a> są niezbędne do prawidłowego wysłania aplikacji.</li>

                        <li><strong>Oferty Pracy</strong> – oferty zatrudnienia u Usługodawcy, w tym także ogłoszenia o pracę opublikowane przez Usługodawcę w Serwisie m.in. na stronie głównej, a także w zakładce pn. „Oferty pracy".</li>

                        <li><strong>Formularz Kontaktowy</strong> - formularz udostępniony w Serwisie pod adresem: <a href="https://seniornaplus.pl/kontakt" className="text-coral underline hover:no-underline">https://seniornaplus.pl/kontakt</a>, umożliwiający Użytkownikom kontakt z Usługodawcą, w tym m.in. skierowanie zapytania do Serwisu. Prawidłowe wypełnienie Formularza Kontaktowego oraz wyrażenie niezbędnych zgód na przetwarzanie Danych Osobowych, a także akceptacja Warunków Korzystania z Serwisu oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a> są niezbędne do prawidłowego wysłania zapytania.</li>

                        <li><strong>Pliki Cookies (tzw. „ciasteczka")</strong> – pliki tekstowe, w których serwery Serwisu zapisują informacje na dysku twardym komputerach lub urządzenia mobilnego, z którego korzysta Użytkownik. Informacje zapisane w pliku „ciasteczka" serwer Serwisu może odczytać przy ponownym połączeniu się z tego urządzenia, lecz mogą być one odczytywane również przez inne serwery lub innych użytkowników Internetu.</li>

                        <li><strong>RODO</strong> – Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych).</li>

                        <li><strong>UODO</strong> - Ustawa o ochronie danych osobowych z dnia 10 maja 2018 r. (Dz. U. 2018 poz. 1000 ze zm.).</li>

                        <li><strong>USUDE</strong> - Ustawa z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (t.j. Dz. U. z 2024 r. poz. 1513).</li>

                        <li><strong>Dane Osobowe/Dane-</strong> wszelkie informacje o zidentyfikowanej lub możliwej do zidentyfikowania osobie fizycznej.</li>

                        <li><strong>Polityka Prywatności</strong> – niniejsza polityka prywatności Serwisu udostępniona w zakładce pn. „Polityka Prywatności", pod adresem: <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityka Prywatności</a>.</li>

                        <li><strong>Warunki Korzystania</strong> – niniejsze Warunki Korzystania, udostępnione w zakładce pn. „Warunki korzystania", pod adresem: <a href="/terms-of-use" className="text-coral underline hover:no-underline">Warunki Korzystania</a>.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>II. Postanowienia ogólne.</strong></p>

                    <ol>
                        <li>
                            Niniejsze Warunki Korzystania określają:
                            <ol type="a" className='ml-5'>
                                <li>warunki Świadczenia Usług, w tym:
                                    <ol type="i" className='ml-5'>
                                        <li>wymagania techniczne niezbędne do współpracy z systemem teleinformatycznym, którym posługuje się Usługodawca,</li>
                                        <li>zakaz dostarczania przez Usługobiorcę treści o charakterze bezprawnym;</li>
                                    </ol>
                                </li>
                                <li>prawa i obowiązki Usługodawcy oraz Usługobiorców związane ze świadczeniem Usług,</li>
                                <li>zasady korzystania z Serwisu przez Użytkowników,</li>
                                <li>zasady wyłączenia odpowiedzialności Usługodawcy z tytułu świadczenia Usług,</li>
                                <li>rodzaje i zakres Usług,</li>
                                <li>warunki zawierania i rozwiązywania Umowy o Świadczenie Usług,</li>
                                <li>tryb postępowania reklamacyjnego.</li>
                            </ol>
                        </li>

                        <li>Usługodawca nieodpłatnie udostępnia Usługobiorcy Warunki Korzystania przed zawarciem Umowy, a także – na jego żądanie – w taki sposób, który umożliwia pozyskanie, odtwarzanie i utrwalanie treści Warunków Korzystania za pomocą systemu teleinformatycznego, którym posługuje się Usługobiorca.</li>

                        <li>Usługodawca świadczy Usługi zgodnie z Warunkami Korzystania, USUDE oraz innymi powszechnie obowiązującymi przepisami prawa.</li>

                        <li>Usługobiorca jest zobowiązany do przestrzegania postanowień Warunków Korzystania, które zostały mu udostępnione w sposób opisany w ust. 2 powyżej.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>III. Warunki świadczenia Usług.</strong></p>

                    <ol>
                        <li>
                            Wymagania techniczne niezbędne do współpracy z systemem teleinformatycznym, w którym operuje Serwis są następujące:
                            <ol className='ml-5'>
                                <li>komputer lub urządzenie mobilne,</li>
                                <li>połączenie z siecią Internet,</li>
                                <li>przeglądarka internetowa umożliwiająca wyświetlanie na ekranie komputera lub urządzenia mobilnego dokumentów HTML. Przeglądarka powinna akceptować Pliki Cookies („ciasteczka"),</li>
                                <li>dostęp do poczty elektronicznej.</li>
                            </ol>
                        </li>

                        <li>Zastrzeżenia wymaga fakt, iż Usługodawca nie jest dostawcą usługi Internetu. W celu korzystania z Usług, Usługobiorca powinien dysponować stanowiskiem komputerowym lub urządzeniem mobilnym z dostępem do Internetu, za pomocą którego możliwe jest korzystanie z Usług za pośrednictwem Serwisu.</li>

                        <li>
                            Zakazuje się dostarczania przez Usługobiorcę treści o charakterze bezprawnym, w szczególności z zakresu erotyki lub pornografii. Użytkownikowi zabrania się również rozpowszechniania wirusów, w tym trojanów i innych szkodliwych plików, a także uzyskiwania dostępu do danych, które nie są dla niego przeznaczone i które są specjalnie zabezpieczone przed nieautoryzowanym dostępem, poprzez obejście zabezpieczeń dostępu lub wykorzystywania tych danych. Ponadto, zabrania się również wysyłanie niechcianych wiadomości e-mail (spamu). Zabroniona jest również dystrybucja obraźliwych, obscenicznych lub zniesławiających treści, wiadomości lub komunikatów, a także takich, które mogą promować lub wspierać rasizm, fanatyzm, nienawiść, przemoc fizyczną lub czyny niezgodne z prawem (pośrednio lub bezpośrednio). Zakazana jest również dystrybucja lub publiczne odtwarzanie treści dostępnych w Serwisie, chyba że właściciel Serwisu wyraźnie na to zezwoli. W przypadku złamania rzeczonych zakazów, Usługodawca ma prawo rozwiązać Umowę w trybie natychmiastowym.
                        </li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>IV. Prawa i obowiązki Usługodawcy.</strong></p>

                    <ol>
                        <li>Usługodawca zobowiązuje się do stałego i nieprzerwanego świadczenia Usług, zgodnie z bieżącymi możliwościami technologicznymi, z zastrzeżeniem ust. 2 poniżej.</li>

                        <li>
                            Usługodawca zastrzega sobie prawo do:
                            <ol className='ml-5'>
                                <li>przejściowego zaprzestania świadczenia Usług z uwagi na czynności konserwacyjne lub inne związane z modyfikacją Serwisu,</li>
                                <li>wysyłania na adres elektroniczny Usługobiorcy komunikatów technicznych, prawnych i transakcyjnych związanych ze świadczeniem Usług,</li>
                                <li>modyfikacji świadczonych Usług, a w szczególności narzędzi, funkcji oraz sposobu działania Serwisu,</li>
                                <li>wprowadzenia odpłatności dotychczasowych Usług lub nowych Usług zarówno odpłatnych jak i nieodpłatnych,</li>
                                <li>usunięcia z Serwisu treści udostępnianych przez Usługobiorcę w Serwisie, jeśli treści te naruszają postanowienia niniejszych Warunków Korzystania lub przepisy powszechnie obowiązującego prawa,</li>
                                <li>rozwiązania Umowy w trybie natychmiastowym, w przypadku dostarczania przez Usługobiorcę treści o charakterze bezprawnym.</li>
                            </ol>
                        </li>

                        <li>Usługodawca reaguje na zgłoszenia Użytkownika dotyczące zakłóceń w pracy Serwisu, w ciągu 24 godzin od ich otrzymania. Zgłoszenia otrzymane w terminie od piątku od godziny 16:00 do niedzieli do godziny 23:59 zostaną rozwiązane w poniedziałek do godziny 23:59. W przypadku przesłania zgłoszenia w dni ustawowo wolne od pracy, dyspozycja zostanie zrealizowana najpóźniej do końca (do godziny 23:59) następującego po nich dnia roboczego.</li>

                        <li>Usługodawca zobowiązuje się do udzielenia wszelkiej możliwej pomocy Użytkownikom w razie wystąpienia u nich jakichkolwiek problemów w korzystaniu z Usług Serwisu.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>V. Prawa i obowiązki Użytkownika.</strong></p>

                    <ol>
                        <li>Umowa o Świadczenie Usług zostaje zawarta z Użytkownikiem z chwilą rozpoczęcia korzystania z Usług Serwisu, po uprzednim wyrażeniu niezbędnych zgód na przetwarzanie Danych Osobowych, akceptacji Warunków Korzystania oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a>.</li>

                        <li>
                            Użytkownik korzystający z Usług oświadcza, że:
                            <ol className='ml-5'>
                                <li>jest pełnoletni i posiada pełną zdolność do czynności prawnych,</li>
                                <li>podane przez niego Dane są kompletne, prawdziwe i zgodne ze stanem faktycznym oraz nie naruszają praw osób trzecich,</li>
                                <li>przed rozpoczęciem korzystania z Usług wyraża stosowną zgodę na przetwarzanie jego Danych Osobowych w celu realizacji Umowy,</li>
                                <li>akceptuje niniejsze Warunki Korzystania oraz zobowiązuje się do ich przestrzegania,</li>
                                <li>akceptuje zapisy <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności</a>.</li>
                            </ol>
                        </li>

                        <li>
                            Użytkownik ma prawo do:
                            <ol className='ml-5'>
                                <li>informacji odnośnie oferowanych Usług i korzystania z nich,</li>
                                <li>wglądu do jego Danych Osobowych przetwarzanych przez Usługodawcę,</li>
                                <li>edycji jego Danych Osobowych przetwarzanych przez Usługodawcę w Serwisie,</li>
                                <li>usunięcia jego Danych Osobowych, przetwarzanych przez Usługodawcę;</li>
                                <li>skorzystania z pozostałych uprawnień w zakresie ochrony jego Danych Osobowych, które zostały określone w <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityce Prywatności Serwisu</a>.</li>
                            </ol>
                        </li>

                        <li>W razie zgłoszenia problemu przez Użytkownika do Usługodawcy, jest on zobowiązany do udzielenia odpowiedzi w ciągu 48 godzin od otrzymania zgłoszenia, z wyłączeniem dni nieroboczych (sobota) oraz dni ustawowo wolnych od pracy (niedziela oraz święta). W przypadku zgłoszeń otrzymanych w dni nierobocze lub ustawowo wolne od pracy, Usługodawca udzieli odpowiedzi pierwszego dnia roboczego, po okresie wolnym od pracy.</li>

                        <li>W przypadku bardziej skomplikowanych zapytań, Usługodawca zastrzega sobie możliwość wydłużenia okresu odpowiedzi do 7 dni roboczych.</li>

                        <li>Usługodawca udziela informacji Użytkownikom zgodnie ze swoją wiedzą oraz posiadanymi kompetencjami.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>VI. Rodzaje Usług świadczonych na rzecz Użytkownika.</strong></p>

                    <ol>
                        <li>Usługi realizowane na rzecz Użytkownika w Serwisie mają charakter odpłatny i nieodpłatny, z zastrzeżeniem wynikającym z rozdziału IV ust. 2 pkt. 4 powyżej niniejszych Warunków Korzystania.</li>

                        <li>Usługodawca zobowiązuje się do rozpoczęcia świadczenia Usług na rzecz Użytkownika z chwilą zainicjowania przez niego rozpoczęcia korzystania z Usług Serwisu (np. poprawnego wypełnienia i wysłania Formularza Rekrutacyjnego albo Formularza Kontaktowego lub udzielenia zgody na wysyłanie Newslettera), po uprzednim wyrażeniu niezbędnych zgód na przetwarzanie Danych Osobowych, akceptacji Warunków Korzystania oraz <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności Serwisu</a>.</li>

                        <li>Usługodawca umożliwia Użytkownikowi w ramach korzystania z Serwisu dostęp do: przeglądania Ofert Pracy (opublikowanych m.in. na stronie głównej, a także w zakładce pn. „Oferty pracy"), Formularza Rekrutacyjnego, Formularza Kontaktowego oraz Newsletteru.</li>

                        <li>Usługodawca w ramach Newslettera udostępnia nieodpłatnie Użytkownikom informacje na różne tematy powiązane z branżą HR (branżą pracowniczą, rynkiem pracy, zarówno w ujęciu krajowym jak i globalnym) oraz treści o tematyce lifestylowej. Informacje te, mimo iż są starannie przygotowywane przez zespół profesjonalistów z branży, mają charakter edukacyjny, niewiążący i ogólny. Nie stanowią i nie mogą zastąpić indywidualnej porady, w szczególności prawnej ani medycznej. W związku z tym Usługodawca nie ponosi odpowiedzialności za dokładność, rzetelność lub kompletność poszczególnych treści. Ponadto, treści zawarte w Newsletterze mogą mieć charakter marketingowy.</li>

                        <li>Usługodawca świadczy usługę polegającą na zbieraniu aplikacji Kandydatów chętnych do podjęcia pracy u Usługodawcy za pośrednictwem Formularza Rekrutacyjnego.</li>

                        <li>Usługodawca świadczy usługę polegającą na możliwości skierownia zapytania do Serwisu za pośrednictwem Formularza Kontaktowego.</li>

                        <li>Usługodawca świadczy usługę polegającą na możliwości przeglądania Ofert Pracy opublikowanych m.in. na stronie głównej, a także w zakładce pn. „Oferty pracy".</li>

                        <li>W Serwisie mogą zostać umieszczone linki do zewnętrznych stron internetowych należących do podmiotów trzecich, na których treść Usługodawca niema wpływu. Wobec powyższego, Usługodawca zastrzega, że nie może ponosić żadnej odpowiedzialności za treści w nich zawarte. Wyłączna odpowiedzialność spoczywa na właścicielu przedmiotowej strony internetowej. Spółka sprawdziła linki do stron w momencie ich umieszczana i nie znajdowały się tam treści o charakterze bezprawnym. Jeśli Spółka poweźmie informację o naruszeniach prawa w tym zakresie, zbada sprawę i dokona usunięcia linków o bezprawnych treściach. Pomimo dołożenia największych starań, Usługodawca nie może ponosić żadnej odpowiedzialności za treść linków zewnętrznych. Operatorzy linkowanych stron ponoszą wyłączną odpowiedzialność za ich treść.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>VII. Reklamacje.</strong></p>

                    <ol>
                        <li>Usługobiorcy mają prawo składać reklamacje w sprawach dotyczących realizacji Usług, Reklamacja powinna być przesłana drogą mailową bezpośrednio na adres kontaktowy <strong><a href="mailto:kontakt@seniornaplus.pl" className="text-coral underline hover:no-underline">kontakt@seniornaplus.pl</a></strong> Reklamacja jest rozpatrywana przez Usługodawcę.</li>

                        <li>
                            Reklamacja powinna zawierać:
                            <ol className='ml-5'>
                                <li>dane Usługobiorcy (Imię i nazwisko, adres e-mail),</li>
                                <li>opis Usługi, której dotyczy reklamacja,</li>
                                <li>okoliczności uzasadniające reklamację,</li>
                                <li>ewentualne uwagi lub sugestie dotyczące rozpatrzenia zgłoszenia.</li>
                            </ol>
                        </li>

                        <li>Reklamacje nie zawierające powyższych danych nie będą rozpatrywane.</li>

                        <li>Usługodawca dołoży starań, by reklamacje były rozpatrywane w terminie do 10 dni roboczych od daty ich otrzymania. Usługodawca powiadomi Usługobiorcę o sposobie rozpatrzenia reklamacji niezwłocznie za pośrednictwem poczty elektronicznej, na adres podany w treści reklamacji.</li>

                        <li>Reklamacje rozpatrzone zgodnie z postanowieniami Warunków Korzystania nie podlegają dalszemu ani ponownemu rozpatrzeniu.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>VIII. Odpowiedzialność.</strong></p>

                    <ol>
                        <li>
                            Usługodawca nie ponosi odpowiedzialności za:
                            <ol className='ml-5'>
                                <li>jakiekolwiek szkody powstałe na skutek zaprzestania świadczenia Usług,</li>
                                <li>jakiekolwiek szkody wyrządzone osobom trzecim, powstałe w wyniku korzystania przez Użytkowników z Serwisu w sposób sprzeczny z Warunkami Korzystania lub powszechnie obowiązującymi przepisami prawa,</li>
                                <li>za prawdziwość i kompletność danych pochodzących od Użytkowników,</li>
                                <li>utratę przez Usługobiorcę wszelkich danych spowodowaną działaniem czynników zewnętrznych (np. brak prądu) lub innych okoliczności niezależnych od Usługodawcy (np. działanie osób trzecich, siła wyższa),</li>
                                <li>szkody wynikające z braku ciągłości dostarczanych Usług, wynikające z czynników na które Usługodawca nie ma wpływu (np. działanie i zaniechanie osób trzecich, siła wyższa),</li>
                                <li>nieprzestrzeganie przez Usługobiorcę Warunków Korzystania.</li>
                            </ol>
                        </li>

                        <li>Z zastrzeżeniem postanowień ust. 1 powyżej, odpowiedzialność Usługodawcy za utratę danych, w tym Danych Osobowych przez Użytkowników ogranicza się do szkód, które powstałyby nawet w przypadku regularnego tworzenia kopii zapasowych danych przez Użytkownika.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>IX. Ochrona Danych Osobowych.</strong></p>

                    <ol>
                        <li>Każdy Usługobiorca ma prawo do ochrony Danych Osobowych przez Usługodawcę. <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityka Prywatności</a> jest dostępna bezpośrednio w Serwisie pod adresem: <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityka Prywatności</a>.</li>

                        <li>Administratorem Danych Osobowych Usługobiorców jest Usługodawca. Przetwarzanie Danych Osobowych odbywa się zgodnie z RODO oraz UODO.</li>

                        <li>W sprawach związanych z ochroną danych i realizacją swoich praw Usługobiorca może kontaktować się mailowo na adres: <a href="mailto:iod@seniornaplus.pl" className="text-coral underline hover:no-underline">iod@seniornaplus.pl</a>.</li>

                        <li>
                            Usługodawca jako administrator będzie przetwarzać następujące Dane Osobowe Usługobiorcy:
                            <ol className='ml-5'>
                                <li>Dane identyfikujące (np. imię, nazwisko),</li>
                                <li>Dane kontaktowe (np. adres e-mail, numer telefonu),</li>
                                <li>Dane dotyczące wykształcenia, wykonywanego zawodu, znajomości języka obcego, doświadczenia zawodowego, kwalifikacji zawodowych i dodatkowych umiejętności (m.in. kurs pierwszej pomocy czy prawo jazdy), preferencje dotyczące zatrudnienia (w tym oczekiwania finansowe) oraz referencje od poprzednich pracodawców,</li>
                                <li>Dane dotyczące aktywności, działań i sesji Użytkowników w Serwisie,</li>
                                <li>Dane o urządzeniach oraz systemie operacyjnym Użytkownika,</li>
                                <li>Dane z przeglądarki internetowej Użytkownika,</li>
                                <li>Dane dotyczące lokalizacji oraz numeru IP Użytkownika,</li>
                                <li>Dane zawarte w treści wiadomości w Formularzu Kontaktowym.</li>
                            </ol>
                        </li>

                        <li>
                            Dane Osobowe Usługobiorcy będą przetwarzane w celu:
                            <ol className='ml-5'>
                                <li>zawarcia, wykonania i monitorowania wykonywania Umowy o Świadczenie Usług - przez okres poprzedzający zawarcie umowy oraz przez okres wykonywania Umowy (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. b) RODO – przetwarzanie jest niezbędne do wykonania umowy);</li>
                                <li>niezbędnym dla wykonania obowiązków prawnych, w szczególności przepisów podatkowych, przepisów o rachunkowości - przez okres wynikający z tych przepisów (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. c) RODO - wykonanie obowiązku nałożonego przepisami prawa);</li>
                                <li>ewentualnego ustalenia i dochodzenia roszczeń lub obrony przed roszczeniami, w tym sprzedaży wierzytelności - przez czas trwania postępowań i okres przedawnienia potencjalnych roszczeń (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. f) RODO - realizacja prawnie uzasadnionego interesu Usługodawcy w postaci dochodzenia roszczeń i obrony przed roszczeniami związanymi z Umową);</li>
                                <li>proponowania Ofert Pracy oraz dla potrzeb niezbędnych do udziału w procesach rekrutacji przez okres do odwołania zgody (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO - osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów),</li>
                                <li>marketingu bezpośredniego usług i produktów własnych - przez okres do czasu wniesienia sprzeciwu przez Użytkownik (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. f) RODO – realizacja prawnie uzasadnionego interesu Usługodawcy lub prawnie uzasadniony interes w związku z przepisami ustawy z dnia 12 lipca 2024 r. Prawo komunikacji elektronicznej);</li>
                                <li>prowadzenia innych działań marketingowych niż określone w pkt. 5 powyżej - przez okres do odwołania zgody przez Użytkownika (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO - osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów),</li>
                                <li>realizacji zapytania przez Formularz Kontaktowy przez okres do odwołania zgody lub zakończenia obsługi zapytania (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO - osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów),</li>
                                <li>w celu zapewnienia funkcjonowania i dostępu Serwisu Użytkownikom (podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a) RODO - osoba, której dane dotyczą wyraziła zgodę na przetwarzanie swoich danych osobowych w jednym lub większej liczbie określonych celów).</li>
                            </ol>
                        </li>

                        <li>Pozyskanie lub podanie Danych Osobowych jest dobrowolne i jest warunkiem niezbędnym do korzystania z funkcjonalności Serwisu, a także do realizacji Umowy o Świadczenie Usług lub podjęcia działań przed zawarciem Umowy. W przypadku niepodania Danych Osobowych nie będzie możliwa realizacja Umowy lub podjęcie działań przed zawarciem Umowy. Brak zgody na przetwarzanie Danych może również wpłynąć negatywnie na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.</li>

                        <li>
                            Usługobiorca, który wyraził zgodę na przetwarzanie jego Danych Osobowych w celu:
                            <ol className='ml-5'>
                                <li>proponowania Ofert Pracy oraz dla potrzeb niezbędnych do udziału w procesach rekrutacji i/lub</li>
                                <li>realizacji zapytania przez Formularz Kontaktowy i/lub</li>
                                <li>w celu prowadzenia działań marketingowych (o których mowa w rozdziale ust. 5 pkt. 6 powyżej) i/lub</li>
                                <li>zapewnienia funkcjonowania i dostępu Serwisu,</li>
                            </ol>
                            ma prawo do cofnięcia zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem. Cofnięcie zgody nie pociąga za sobą negatywnych konsekwencji, może mieć jednak wpływ na dalsze korzystanie z usług Serwisu, które zgodnie z prawem Usługodawca świadczy na podstawie zgody (podstawa prawna – art. 7 ust. 3 RODO).
                        </li>

                        <li>Użytkownik, którego Dane Osobowe przetwarzane są w celu marketingu bezpośredniego usług i produktów własnych Usługodawcy (ust. 5 pkt. 5 powyżej) ma prawo do wniesienia sprzeciwu w dowolnym momencie, bez podania przyczyny. Jeśli sprzeciw okaże się zasadny, wówczas Usługodawca usuwa dane, wobec których został zgłoszony sprzeciw (podstawa prawna – art. 21 RODO).</li>

                        <li>
                            Usługobiorca ma również prawo:
                            <ol className='ml-5'>
                                <li>
                                    dostępu do swoich Danych Osobowych oraz otrzymania ich kopii – Użytkownik (lub osoba dla której szuka opieki) ma prawo do uzyskania potwierdzenia odnośnie przetwarzanych Danych, a także do uzyskania:
                                    <ol type="a" className='ml-5'>
                                        <li>dostępu do swoich Danych Osobowych,</li>
                                        <li>informacji o celach przetwarzania, kategoriach przetwarzanych Danych Osobowych, ich odbiorcach lub kategoriach odbiorców, a także planowanym okresie przechowywania (lub kryteriach decydujących o okresie przechowywania),</li>
                                        <li>informacji o prawach przysługujących na podstawie RODO oraz prawie do wniesienia skargi do organu nadzorczego, źródle danych, zautomatyzowanym podejmowaniu decyzji (w tym profilowaniu),</li>
                                        <li>informacji o zabezpieczeniach stosowanych w związku z przekazywaniem danych poza Unię Europejską,</li>
                                        <li>kopii swoich Danych Osobowych (podstawa prawna – art. 15 RODO).</li>
                                    </ol>
                                </li>
                                <li>sprostowania (poprawiania) swoich Danych Osobowych – Użytkownik ma prawo do sprostowania i uzupełnienia swoich Danych Osobowych (podstawa prawna – art. 16 RODO).</li>
                                <li>
                                    ograniczenia przetwarzania Danych Osobowych - zgłoszenie takie może wiązać się z ograniczeniem możliwości korzystania z usług Serwisu, do których wymagane jest przetwarzanie określonych kategorii Danych Osobowych, a także z przerwaniem wysyłania komunikatów marketingowych; Użytkownik ma prawo do żądania ograniczenia wykorzystywania Danych Osobowych w przypadku:
                                    <ol type="a" className='ml-5'>
                                        <li>kwestionowania prawidłowości Danych Osobowych przez Użytkownika – wiąże się z ograniczeniem wykorzystywania Danych przez okres nie dłuższy niż 7 dni,</li>
                                        <li>niezgodnego z prawem przetwarzanie Danych Osobowych Użytkownika,</li>
                                        <li>w sytuacji, gdy Dane Osobowe Użytkownika nie są już niezbędne do celów, w których zostały zebrane lub wykorzystywane, jednak są potrzebne Użytkownikowi, w celu ustalenia dochodzenia lub obrony roszczeń,</li>
                                        <li>w sytuacji wniesienia sprzeciwu wobec wykorzystywania Danych Osobowych – ograniczenie następuje na okres niezbędny do rozważenia, czy ochrona interesów, praw oraz wolności Użytkownika przeważa nad interesami, które są realizowane przez Usługodawcę (podstawa prawna – art. 18 RODO).</li>
                                    </ol>
                                </li>
                                <li>
                                    usunięcia Danych Osobowych – tzw. „prawo do bycia zapomnianym" – Użytkownik ma prawo do żądania usunięcia wszystkich lub niektórych Danych Osobowych przetwarzanych przez Usługodawcę; prawo do bycia zapomnianym przysługuje w następujących przypadkach:
                                    <ol type="a" className='ml-5'>
                                        <li>wycofanie przez Użytkownika określonej zgody, w zakresie przetwarzania Danych opartych na uprzedniej zgodzie,</li>
                                        <li>Dane Osobowe przestały być niezbędne do celów, w których zostały zebrane lub przetwarzane,</li>
                                        <li>Użytkownik wniósł sprzeciw wobec wykorzystywania jego Danych w celach marketingowych, statystycznych lub badania satysfakcji,</li>
                                        <li>Dane Osobowe Użytkownika są przetwarzane niezgodnie z prawem.</li>
                                    </ol>
                                </li>
                                <li>przenoszenia Danych Osobowych – Użytkownik ma prawo otrzymać Dane Osobowe, które dostarczył, a następnie przesłać je do innego, wybranego przez siebie administratora danych osobowych; Użytkownik ma również prawo żądać, aby Dane Osobowe zostały przesłane bezpośrednio innemu administratorowi, o ile jest to technicznie możliwe; Usługodawca będący w posiadaniu Danych Osobowych Użytkownika prześle Dane, o których mowa powyżej w postaci ogólnie znanego i możliwego do odtworzenia formatu pliku (np. doc., xls.) (podstawa prawna – art. 20 RODO),</li>
                                <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
                                <li>wniesienia sprzeciwu - z przyczyn związanych ze szczególną sytuacją; Użytkownikowi przysługuje prawo wniesienia sprzeciwu wobec przetwarzania, które dokonywane jest przez Usługodawcę z uwagi na jego niezbędność dla realizacji prawnie uzasadnionych interesów Usługodawcy.</li>
                            </ol>
                        </li>

                        <li>
                            Odbiorcami Danych Osobowych Usługobiorcy mogą być:
                            <ol>
                                <li>dostawcy systemów informatycznych oraz usług IT,</li>
                                <li>podmioty świadczące na rzecz Usługodawcy usługi księgowe, badania jakości obsługi, dochodzenia należności, usługi prawne, analityczne, marketingowe,</li>
                                <li>operatorzy pocztowi i kurierzy,</li>
                                <li>operatorzy systemów płatności elektronicznych oraz banki w zakresie realizacji płatności,</li>
                                <li>podmioty, które nabywają wierzytelności i podmioty windykacyjne - w razie braku wykonania przez Użytkownika zobowiązań na podstawie Umowy o Świadczenie Usług,</li>
                                <li>podwykonawcy, współpracownicy i klienci Usługodawcy, czyli podmioty, które wykonują za Usługodawcę lub we współpracy z nim Usługę lub korzystają z usług świadczonych przez Usługodawcę, z których realizacją związana jest Umowa,</li>
                                <li>operatorzy portali społecznościowych i serwisów internetowych o których mowa w rozdziale XII <a href="/privacy-policy" className="text-coral underline hover:no-underline">Polityki Prywatności</a>,</li>
                                <li>organy uprawnione do otrzymania Danych Osobowych na podstawie przepisów prawa.</li>
                            </ol>
                        </li>

                        <li>Dane Użytkowników mogą być przekazywane do państw trzecich tj. Wielka Brytania czy Stany Zjednoczone Ameryki. Przekazanie Danych Osobowych do Wielkiej Brytanii jest możliwe z uwagi na fakt, iż 28 czerwca 2021 r. Komisja Europejska stwierdziła w dwóch decyzjach wykonawczych, iż Zjednoczone Królestwo Wielkiej Brytanii i Irlandii Północnej zapewnia odpowiedni poziom ochrony Danych Osobowych równoważny z poziomem gwarantowanym na mocy DSGVO (decyzje KE nr C(2021) 4800 final oraz C(2021) 4801 final). Przekazanie Danych Osobowych do Stanów Zjednoczonych Ameryki jest możliwe z uwagi na fakt, iż 10 lipca 2023 r. Komisja Europejska przyjęła nową decyzję wykonawczą stwierdzającą odpowiedni stopień ochrony danych osobowych zapewniony przez tzw. "Ramy ochrony danych UE-USA" (EU-US Data Privacy Framework - decyzje KE 2023/1795 - notyfikowana jako dokument nr C(2023) 4745).</li>

                        <li>Wobec Danych Osobowych Użytkowników nie jest stosowany mechanizm automatycznego podejmowania decyzji, w tym profilowania. Jeśli w indywidualnych przypadkach Usługodawca będzie korzystać z tych procedur, poinformuje o tym Użytkownika, jeśli będzie to wymagane przez prawo.</li>

                        <li>Dane Osobowe Usługobiorcy będą przetwarzane przez okres trwania Umowy o Świadczenie Usług oraz po jej zakończeniu, aż do upływu ustawowego okresu przedawnienia roszczeń oraz ustawowych okresów nakazujących przechowywanie dokumentacji Usługobiorcy.</li>

                        <li>Usługodawca może powierzyć przetwarzanie Danych Osobowych innemu podmiotowi w drodze umowy powierzenia danych zgodnie z RODO oraz UODO.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>X. Postanowienia końcowe.</strong></p>

                    <ol>
                        <li>Umowa o Świadczenie Usług może być rozwiązana przez którąkolwiek ze stron.</li>

                        <li>Użytkownik ma prawo rozwiązać Umowę bądź poprzez cofnięcie zgody na przetwarzanie jego danych (np. kliknięcie przycisku „unsubscribe" w mailu na końcu Newslettera) lub poprzez mailowe bądź telefoniczne poinformowanie o tym fakcie Usługodawcy (na maila o którym mowa w rozdziale I ust. 1 Warunków Korzystania).</li>

                        <li>
                            Usługodawca ma prawo rozwiązać Umowę o Świadczenie Usług, ze skutkiem natychmiastowym, w następujących przypadkach:
                            <ol className='ml-5'>
                                <li>rażącego naruszenia przez Usługobiorcę postanowień niniejszych Warunków Korzystania,</li>
                                <li>uzyskania przez Usługodawcę wiarygodnych informacji, że dane Usługobiorcy są nieprawdziwe, sprzeczne z prawem, dobrymi obyczajami, a także naruszają dobra osób trzecich lub interesy Usługodawcy,</li>
                                <li>wykorzystania przez Usługobiorcę Usługi niezgodnie z jej przeznaczeniem,</li>
                                <li>usunięcia przez Usługobiorcę adresu poczty elektronicznej, która była użyta do wysyłki Newslettera,</li>
                                <li>uzyskania przez Usługodawcę wiarygodnej informacji o założeniu przez Użytkownika lub jego pracownika lub osobę zatrudnioną przez niego na podstawie umowy cywilnoprawnej, jego wspólnika lub osoby zasiadającej w organach spółki albo podmiotu powiązanego osobowo lub kapitałowo z Użytkownikiem, portalu konkurencyjnego, tj. w szczególności oferującego takie same lub podobne Usługi w stosunku do Serwisu,</li>
                                <li>dostarczania przez Usługobiorcę treści o charakterze bezprawnym.</li>
                            </ol>
                        </li>

                        <li>W przypadku rozwiązania Umowy na podstawie ust. 3 powyżej, Usługodawca poinformuje o tym fakcie Usługobiorcę drogą mailową.</li>
                    </ol>
                </section>
                <section>
                    <p className='my-2'><strong>XI. Własność intelektualna.</strong></p>

                    <ol>
                        <li>Wszystkie treści zamieszczone w Serwisie, a także w Newsletterze są chronione prawem, w szczególności z zakresu prawa własności intelektualnej (m.in. prawa autorskie, prawo własności przemysłowej itp.) i należą do Usługodawcy.</li>

                        <li>Jakiekolwiek wykorzystanie przez kogokolwiek, bez wyraźnej pisemnej zgody Usługodawcy, któregokolwiek z elementów składających się na treść oraz zawartość Serwisu lub Newsletteru stanowi naruszenie praw przysługujących Usługodawcy i skutkuje odpowiedzialnością cywilnoprawną oraz karną.</li>

                        <li>Wszystkie nazwy handlowe, nazwy firm (w tym nazwa Serwisu) i ich logo (w tym logo Serwisu) użyte na stronie internetowej Serwisu lub w Newsletterze należą do ich właścicieli i są używane wyłącznie w celach identyfikacyjnych. Mogą być one zastrzeżonymi znakami towarowymi. Wszystkie materiały, opisy i zdjęcia prezentowane na stronie internetowej Serwisu lub w Newsletterze użyte są w celach informacyjnych.</li>

                        <li>Usługobiorca przesyłając Serwisowi zdjęcia oraz inne treści cyfrowe ponosi wyłączną odpowiedzialność za naruszenia autorskich praw majątkowych i pokrewnych oraz dóbr osobistych osób trzecich z tego tytułu, a w wypadku wystąpienia przez jakąkolwiek osobę z jakimikolwiek roszczeniami lub żądaniami w stosunku do Serwisu lub Usługodawcy w tym zakresie, zobowiązuję się zwolnić Serwis i Usługodawcę z wszelkiej odpowiedzialności oraz do całkowitego zaspokojenia roszczeń osób trzecich.</li>
                    </ol>
                </section>

                <section>
                    <p className='my-2'><strong>XII. Postanowienia końcowe.</strong></p>

                    <ol>
                        <li>W razie istotnych zmian w Usługach lub jakichkolwiek innych ważnych przyczyn Usługodawca ma prawo do jednostronnej zmiany Warunków Korzystania. Zmiany Warunki Korzystania wchodzą w życie z dniem opublikowania zmienionych Warunków Korzystania w Serwisie Usługodawcy.</li>

                        <li>O zmianie Warunków Korzystania Usługodawca zawiadomi Usługobiorcę publikując stosowną informację w Serwisie Usługodawcy lub za pośrednictwem wiadomości e-mail.</li>

                        <li>W przypadku o którym mowa w ust. 2 powyżej, Usługobiorca ma prawo rozwiązać Umowę o Świadczenie Usług niezwłocznie po uzyskaniu informacji o zmianie Warunków Korzystania. Jeżeli tego nie zrobi, Użytkownik celem dalszego korzystania z Serwisu winien zaakceptować zmienione postanowienia Warunki Korzystania poprzez kliknięcie odpowiedniego checkbox'u w Serwisie.</li>

                        <li>Jeżeli którekolwiek z postanowień niniejszych Warunków Korzystania jest lub stanie się w przyszłości nieważne, pozostałe postanowienia pozostają w mocy. W miejsce nieważnego postanowienia wchodzi ważne postanowienie, które najbardziej odpowiada intencji ekonomicznej stron.</li>

                        <li>W sprawach nieuregulowanych niniejszymi Warunkami Korzystania, zastosowanie mają przepisy RODO, UODO, USUDE i inne bezwzględnie obowiązujące przepisy na terytorium Rzeczpospolitej Polskiej, z zastrzeżeniem, że jeżeli Użytkownik jest konsumentem obowiązują go prawnie wiążące, korzystniejsze przepisy o ochronie konsumentów obowiązujące w miejscu jego zamieszkania.</li>

                        <li>Wszelkie spory powstałe na gruncie Warunków Korzystania rozstrzygał będzie sąd właściwości ogólnej zgodnie z przepisami prawa Rzeczpospolitej Polskiej, o ile takie porozumienie w sprawie jurysdykcji jest dopuszczalne, w szczególności z uwagi na fakt, że Użytkownik nie ma ogólnej właściwości miejscowej sądu w Polsce.</li>
                    </ol>
                </section>

            </div>
        </AppLayout>
    );
};

export default TermsOfService;
