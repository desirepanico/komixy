# Filtri di Scopri: dati necessari, fonti, uso commerciale e limiti

Analisi del 13 novembre 2026, aggiornata con i termini d'uso e i limiti di richieste. Serve a capire, filtro per filtro, se i dati esistono, dove si trovano e **se si possono importare in un prodotto commerciale**. Oggi `ComicItem` (`shared/models/comic.model.ts`) ha solo titolo, autore, volume, totale volumi, edizione speciale e copertina: **nessuno dei filtri del prototipo si può usare finché questi dati non sono importati**.

**Il documento Google di Komixy** (`1qVUxMlZLfRqNc-bRN-_hwj0Idv6pH8tu-ZC4n_QEO0s`) **non è raggiungibile dall'ambiente di lavoro** (dominio bloccato): la sezione 9 usa solo ciò che mi hai mostrato nelle immagini (tabella del tema narrativo e schermata «Filter Guide») e dice cosa si può verificare. Per allinearla al testo completo serve incollarlo in chat o salvarlo come file nel repository.

Questo documento non è una consulenza legale. Prima di firmare accordi o costruire il catalogo, le condizioni indicate vanno rilette sulle pagine ufficiali e, per le fonti con licenza incerta, chiarite per iscritto con i gestori.

## Come leggere l'affidabilità

| Segno | Significato                                                                                                                                        |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅    | Riportato da una ricerca che cita la pagina ufficiale (termini d'uso, documentazione, sito del progetto). Non ho letto l'intero testo della pagina |
| ⚠️    | Da verificare: viene da pagine di terzi (librerie, forum, directory, articoli) o dalla mia conoscenza                                              |
| ❌    | Non trovato                                                                                                                                        |

**Limite di questa analisi:** dall'ambiente di lavoro le pagine ufficiali non erano raggiungibili direttamente (domini bloccati). Le condizioni vengono dai risultati di ricerca che citano quelle pagine.

## 1. In breve

1. **I dati ci sono, ma le fonti gratuite più comode non si possono usare così come sono in un prodotto commerciale.** Comic Vine e MangaDex vietano l'uso con scopo di lucro ✅. AniList lo permette solo sotto una soglia di ricavi e vieta di usarlo come archivio o di scaricarlo in blocco ✅: è proprio ciò che serve per i filtri. Google Books vieta di costruire una propria base dati ✅.
2. **Fonti utilizzabili con uso commerciale:** Wikidata (dati CC0 ✅), Open Library (metadati dichiarati liberi, da scaricare con i dump ✅), Metron (licenza CC BY-SA 4.0 con permesso esplicito per l'uso commerciale ✅), il catalogo SBN (CC0 deliberato nel 2013 ⚠️) e ISBNdb (a pagamento, con licenza per prodotti commerciali ✅).
3. **Fonti da usare solo con permesso scritto:** MyAnimeList/Jikan (ogni monetizzazione richiede l'autorizzazione di MAL ⚠️), MangaUpdates, Kitsu, Grand Comics Database (progetto "non commerciale", licenze in contrasto ✅).
4. **Il piano realistico per un prodotto commerciale è una base dati nostra**, composta da: cataloghi degli editori (accordi), dati aperti (Wikidata, Open Library, SBN, Metron) e classificazione fatta da noi (categorie, temi, fascia d'età). AniList e MAL si usano solo dopo una licenza commerciale scritta.
5. **Manga: tutti e sei i filtri si possono alimentare**, ma i dati migliori (demografia, temi) vengono da fonti con vincoli commerciali. **Fumetti: i generi non hanno una fonte coerente** e vanno assegnati da noi.
6. **La casa editrice ha senso, e per i fumetti più dei generi.** È presente in ogni fonte e in ogni catalogo ISBN, distingue le edizioni dei collezionisti e fa da categoria. Va intesa come editore dell'edizione italiana (sezione 4.3).
7. **Categorie e temi del documento: la fonte libera è Wikidata.** Ha le voci per tutte e 5 le categorie (Kodomo come «children's manga») e per **tutti i 10 temi**, compreso lo Sport come «spokon» (Q2281511). La copertura per opera è però irregolare (sezione 9).
8. **Il livello dei dati è diverso da quello che mostriamo.** Le banche dati descrivono l'opera; Komixy mostra volumi di un'edizione italiana. I dati dell'edizione (ISBN, editore italiano, variant, deluxe) vengono dai cataloghi ISBN e dagli editori (sezione 2).

## 2. Il modello a due livelli

```text
Opera (serie)                          Edizione / Volume
─────────────────────────              ─────────────────────────────
titolo originale, autore               ISBN, numero del volume
categoria (demografica) / generi       editore italiano
formato (serie / one-shot)             tipo di edizione (variant, deluxe, limitata)
anno di uscita originale               copertina italiana
temi, contenuti per adulti             volumi usciti in Italia
        ▲                                        ▲
 Wikidata, Metron, (AniList, MAL,       cataloghi degli editori, SBN,
 MangaDex, Comic Vine, GCD solo         Open Library, ISBNdb
 se la licenza lo consente)
```

Un filtro come "Seinen" o "Isekai" è una proprietà dell'opera. Un filtro come "Casa editrice" o la "Cover variant" è una proprietà dell'edizione. Servono **entrambi i livelli** e un legame tra loro (opera ↔ edizione), che nessuna fonte fornisce e che all'inizio va fatto con una persona che conferma.

## 3. Manga: filtro per filtro

| Filtro (prototipo)         | Dato da importare | Dove si trova                                                                                                                                                                  | Copertura | Note                                                                                                                                                                         |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Categoria (Shōnen…Josei)   | `demographic`     | MAL (e Jikan): demografie separate da generi e temi ✅ · MangaDex: `publicationDemographic` ⚠️ · Wikidata: proprietà «pubblico di destinazione» (P2360) ✅ · cataloghi editori | Buona     | Kodomo ("Kids") è il meno coperto. Va gestito anche il valore "nessuna". Gli editori italiani spesso indicano la collana (Shōnen, Seinen): fonte consigliata                 |
| Formato (Serie / One-shot) | `format`          | AniList: `format` con `ONE_SHOT` ✅ · MAL: tipo "One-shot" ⚠️ · Wikidata ⚠️                                                                                                    | Buona     | Su AniList `ONE_SHOT` è un manga con un solo capitolo ✅. Si può ricavare anche dal numero di volumi dell'edizione italiana                                                  |
| Anno di uscita             | `year`            | AniList: `startDate.year` ✅ · MangaDex: `year` ✅ · Wikidata: data di pubblicazione ⚠️                                                                                        | Ottima    | È l'anno dell'opera in Giappone, non dell'edizione italiana                                                                                                                  |
| Volumi (1–5, 6–20, 21+)    | `volumes`         | AniList: `volumes` ✅ · MAL/Jikan: `volumes` ✅ · Wikidata: numero di volumi ⚠️                                                                                                | Parziale  | Per le serie in corso il valore è vuoto. Conta i volumi giapponesi: meglio contare quelli dell'edizione italiana                                                             |
| Tema narrativo             | `themes[]`        | AniList: `genres` ✅ e `tags` ✅ · MAL/Jikan: `genres` e `themes` ⚠️ (Isekai è un tema di MAL ✅) · MangaDex: tag per gruppo ⚠️ · Wikidata: genere ⚠️                          | Buona     | Serve la tabella di conversione qui sotto: i temi di Komixy sono 10, le fonti ne hanno decine                                                                                |
| Contenuti per adulti (18+) | `ageRating`       | AniList: `isAdult` ✅ · MangaDex: `contentRating` ✅ · cataloghi editori (fascia d'età)                                                                                        | Parziale  | Le fonti segnalano soprattutto il **contenuto sessuale**. La violenza estrema (per esempio Berserk) di solito non è segnalata come "adulto": serve la nostra classificazione |

### Conversione dei temi (proposta)

I nomi delle fonti sono ⚠️: vanno verificati sull'elenco ufficiale prima di scrivere il codice di importazione.

| Tema Komixy        | AniList (genere o tag) | MAL / Jikan          | Note                                          |
| ------------------ | ---------------------- | -------------------- | --------------------------------------------- |
| Azione / Avventura | Action, Adventure      | Action, Adventure    | Due generi diventano un solo tema             |
| Romance            | Romance                | Romance              |                                               |
| Fantasy            | Fantasy                | Fantasy              |                                               |
| Sci-fi / Mecha     | Sci-Fi, Mecha          | Sci-Fi, Mecha (tema) | Due voci diventano un solo tema               |
| Horror             | Horror                 | Horror, Gore (tema)  | Il gore non è automaticamente horror          |
| Mystery / Giallo   | Mystery                | Mystery              | Per il giallo puro si possono guardare i tag  |
| Commedia           | Comedy                 | Comedy               |                                               |
| Sport              | Sports                 | Sports (tema)        |                                               |
| Slice of life      | Slice of Life          | Slice of Life        |                                               |
| Isekai             | tag "Isekai"           | Isekai (tema)        | Sulle fonti è un tag o un tema, non un genere |

Questa tabella non dipende dalla fonte: se i dati arrivano da Wikidata, dai cataloghi degli editori o da noi, la conversione si fa sugli stessi 10 temi. I generi "Drama", "Supernatural", "Psychological", "Thriller" ed "Ecchi" delle fonti non hanno un tema Komixy.

## 4. Fumetti

### 4.1 Filtro per filtro

| Filtro               | Dato da importare | Dove si trova                                                                                                                                                          | Copertura   | Note                                                                                                                                                   |
| -------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Categoria (generi)   | `categories[]`    | Metron: genere per serie e numero ✅ (elenco non verificato) · Wikidata: genere ⚠️ · GCD: genere per storia ⚠️ (licenza incerta) · Comic Vine: nessun campo trovato ❌ | **Debole**  | Non esiste una fonte coerente. Da assegnare noi, con le fonti come suggerimento                                                                        |
| Formato              | `format`          | Metron: tipo di serie (Annual, Digital Chapters, Hardcover, Limited Series…) ✅ · ISBNdb: legatura e formato ✅ · cataloghi editori                                    | Parziale    | "Serie" e "Volume unico" si ricavano. **Graphic novel e Omnibus sono proprietà dell'edizione** (legatura, raccolta): vengono dal catalogo dell'editore |
| Anno di uscita       | `year`            | Metron: anno di inizio ⚠️ · Wikidata ⚠️ · Open Library / ISBNdb: data di pubblicazione dell'edizione ✅                                                                | Buona       | Chiarire se è l'anno dell'opera o dell'edizione italiana                                                                                               |
| Volumi               | `volumes`         | Metron: numero di numeri ⚠️ · catalogo italiano                                                                                                                        | Poco adatta | In Italia i "volumi" sono raccolte, non numeri americani. Meglio contare i volumi dell'edizione italiana                                               |
| Casa editrice        | `publisher`       | Metron ✅ · Open Library: `publishers` ⚠️ · ISBNdb: campo `publisher` ✅ · catalogo SBN ⚠️ · ogni catalogo ISBN                                                        | **Ottima**  | È l'unico filtro presente in tutte le fonti. Vedi 4.3                                                                                                  |
| Contenuti per adulti | `ageRating`       | Metron: classificazione per età ⚠️ · altrove ❌                                                                                                                        | Debole      | Serve una nostra classificazione                                                                                                                       |

**Attenzione ai fumetti italiani.** Metron e GCD sono centrati sul fumetto americano. Bonelli, Disney, Diabolik e gli altri periodici italiani sono poco o per niente coperti ⚠️, e quelli da edicola spesso non hanno un ISBN. Per questi serve una fonte italiana (sezione 5.3).

### 4.2 Generi per i fumetti: proposta

Nessuna fonte li dà in modo uniforme: propongo un elenco **corto e nostro**, popolato a mano o con una conversione dai generi di Metron dove esistono. È una proposta da confermare: il prototipo usa oggi un elenco diverso.

| Categoria            | Come popolarla                                          | Esempi                     |
| -------------------- | ------------------------------------------------------- | -------------------------- |
| Supereroi            | Dall'universo o dall'editore (Marvel, DC) e dalle fonti | Watchmen, Batman: Anno Uno |
| Fantascienza         | Genere Metron / Wikidata, oppure a mano                 | Saga                       |
| Fantasy              | Genere Metron / Wikidata, oppure a mano                 | Sandman, Saga              |
| Horror               | Genere Metron / Wikidata, oppure a mano                 | Sandman                    |
| Noir / Thriller      | A mano                                                  | V for Vendetta             |
| Storico e biografico | A mano (unisce "Storico" e "Autobiografico")            | Maus, Persepolis           |
| Umorismo             | A mano                                                  |                            |

"Distopico" nel prototipo è un sottogenere (Watchmen, V for Vendetta): nessuna fonte lo dà, e conviene toglierlo o assorbirlo in "Fantascienza".

### 4.3 La casa editrice ha senso?

**Sì, e va tenuta per i fumetti.**

1. **I dati ci sono sempre**, e con licenze utilizzabili: ISBNdb, Open Library e il catalogo SBN la riportano per ogni edizione; i cataloghi degli editori sono la fonte più precisa.
2. **Per un collezionista è un criterio vero.** Due edizioni della stessa opera di editori diversi sono oggetti diversi, e il valore cambia.
3. **Fa da categoria.** Marvel e DC indicano i supereroi, Bao il graphic novel d'autore, Bonelli il fumetto da edicola.

Due scelte da fare prima di importare:

- **Editore italiano o originale?** Per l'utente conta quello dell'edizione che ha in mano (Panini, Bao, Lion…). Propongo l'editore italiano come filtro e l'editore originale (Marvel, DC, Image) come dato secondario.
- **Quanti valori nell'elenco.** Gli editori sono decine: il filtro deve mostrare i più frequenti e permettere la ricerca del resto.

**Anche per i manga la casa editrice è utile**, forse più del tema per chi colleziona: le edizioni italiane (Star Comics, Panini/Planet Manga, J-POP, Edizioni BD, Dynit, Goen e altri ⚠️) hanno formati, prezzi e variant diversi. Propongo di aggiungerla come sesto filtro dei manga, con la stessa fonte dei fumetti.

I nomi degli editori nel prototipo (Lion, Einaudi, Rizzoli Lizard, Bao, Panini) sono editori reali, ma **l'abbinamento ai titoli è inventato**.

## 5. Le fonti: cosa offrono, uso commerciale e limiti

### 5.1 Manga

| Fonte        | Cosa offre                                                                             | Uso commerciale                                                                                                                                                                                                     | Limiti di richieste                                                                            | Importabile nella nostra base dati?                                                                                  | Stato |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----- |
| AniList      | `format`, `genres`, `tags`, `isAdult`, `volumes`, `startDate`, GraphQL senza chiave ✅ | **Solo sotto 150 $ di ricavi al mese; sopra serve una licenza commerciale** (contact@anilist.co) ✅                                                                                                                 | 90 richieste al minuto; a volte ridotte a 30 in modalità degradata ✅. Aumenti non concessi ✅ | **No**: i termini vietano l'uso come archivio dati, la raccolta in blocco e l'uso in servizi concorrenti di liste ✅ | ✅    |
| Jikan (MAL)  | `genres`, `themes`, `demographics`, `volumes`, `published`, `type`                     | Jikan è non ufficiale; per MAL **ogni monetizzazione (abbonamenti, pubblicità oltre il minimo) richiede l'autorizzazione scritta di MAL**, e Jikan ne eredita le regole ⚠️. Testo dei termini di Jikan non letto ❌ | 60 al minuto e 3 al secondo ✅                                                                 | Da chiarire con MAL                                                                                                  | ⚠️    |
| MangaDex     | `publicationDemographic`, `contentRating`, `tags`, `year` ✅                           | **No**: "non devi guadagnare con la nostra API"; vietate pubblicità e servizi a pagamento; va citato MangaDex ✅                                                                                                    | Circa 5 richieste al secondo per IP; oltre, errore 429 e blocco temporaneo ✅                  | No                                                                                                                   | ✅    |
| MangaUpdates | tipo, anno, generi, categorie, editori                                                 | Termini non trovati ❌. Un client di terzi riassume: citare la fonte, distanziare le richieste, usare la cache ⚠️. Sull'uso commerciale nessuna fonte                                                               | Le letture non sono limitate salvo la protezione anti-attacco ⚠️ (forum di 4 anni fa)          | Da chiarire con lo staff                                                                                             | ⚠️    |
| Kitsu        | categorie, sottotipo, volumi, fascia d'età                                             | Termini non trovati ❌                                                                                                                                                                                              | Non trovato ❌                                                                                 | Da chiarire                                                                                                          | ⚠️    |

Nessuna di queste fonti conosce le **edizioni italiane**: descrivono l'opera originale.

### 5.2 Fumetti

| Fonte                 | Cosa offre                                                                          | Uso commerciale                                                                                                                                                                                                                                                                                   | Limiti di richieste                                                                                     | Importabile nella nostra base dati?                                                                                                   | Stato |
| --------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Comic Vine            | Volumi con editore, `start_year`, `count_of_issues`. Nessun campo genere trovato ✅ | **No**: "solo uso non commerciale; l'uso commerciale comporta la revoca della chiave" ✅. Per un'eccezione bisogna contattarli prima ✅. Nessun piano a pagamento trovato ❌                                                                                                                      | 200 richieste per risorsa all'ora ✅                                                                    | No                                                                                                                                    | ✅    |
| Metron                | Serie con editore, tipo, generi, stato; numeri ✅                                   | **Sì**: i dati sono CC BY-SA 4.0 e il progetto dice espressamente che l'uso commerciale è consentito ✅. Va citata Metron. La ShareAlike scatta se distribuisci dati modificati ✅. **Le copertine non sono incluse nella licenza** (Metron le ospita come "fair use") ✅. Il codice è GPL-3.0 ✅ | Un account per ogni utente se l'app è usata da molte persone ✅; limiti numerici non trovati ❌         | **Sì, con attribuzione**; da far valutare se mostrare i dati agli utenti dell'app conta come "distribuzione" ai fini della ShareAlike | ✅    |
| Grand Comics Database | Serie, editori, numeri, storie, generi ⚠️                                           | **Incerto**: il sito dichiara CC BY-SA 4.0, ma i documenti per sviluppatori parlano di CC BY 3.0, e le FAQ definiscono il progetto "senza scopo di lucro" con file di dati "solo per uso personale non commerciale" ✅. Le copertine sono usate come "fair use" ✅                                | Nessuna API stabile: solo dump ✅ (le fonti sono in contrasto)                                          | Solo con permesso scritto                                                                                                             | ✅    |
| Open Library          | Edizioni con `publishers`, soggetti, ISBN, data ⚠️                                  | Metadati dichiarati liberi: i contributi sono CC0 e la pagina delle licenze dice che non rivendica diritti ✅. Un vecchio dump del 2010 era CC BY-NC-SA, in contrasto ✅. L'API **non è per servizi commerciali ad alto traffico** ✅                                                             | 1 richiesta al secondo; 3 se ti identifichi con User-Agent ed email ✅                                  | **Sì, ma con i dump mensili**, non con l'API ✅                                                                                       | ✅    |
| Wikidata              | Opere con genere, editore, data, ISBN ⚠️                                            | **Sì**: tutti i dati strutturati sono CC0 ✅; nessuna attribuzione richiesta, ma se ne chiede la citazione ✅                                                                                                                                                                                     | Il servizio SPARQL limita il tempo di calcolo per client (circa 60 secondi al minuto) ⚠️ (cifra datata) | **Sì**, meglio con i dump per grandi quantità                                                                                         | ✅    |

### 5.3 Cataloghi delle edizioni (per i dati italiani)

Qui sta il livello che manca nelle banche dati sopra.

| Fonte                               | Cosa offre                                                                                                                                         | Uso commerciale                                                                                                                                                                                                                                      | Limiti                                                                                                  | Stato                                          |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Cataloghi degli editori             | ISBN, volume, prezzo, copertina ufficiale, edizione speciale                                                                                       | Con accordo. Sono la fonte più precisa per l'edizione italiana; le copertine sono dell'editore                                                                                                                                                       | Dipendono dall'accordo                                                                                  | ⚠️                                             |
| ISBNdb                              | Fino a 19 dati per libro: ISBN, titolo, autore, data, **editore**, **legatura**, pagine, prezzo, copertina, lingua, edizione, formato, soggetto ✅ | **Sì, con abbonamento attivo**, anche per prodotti a pagamento ✅. I dati in cache vanno cancellati se l'abbonamento scade ✅. Il piano accademico non vale per prodotti commerciali ✅                                                              | Basic 14,99 $/mese: 5.000 ricerche al giorno, 1 chiamata al secondo ✅. Premium 35,99 $, Pro 99,99 $ ✅ | ✅ (prezzi e copertura italiana da verificare) |
| Catalogo SBN (biblioteche italiane) | Edizioni italiane con ISBN, editore, anno                                                                                                          | I dati dell'OPAC SBN sono stati rilasciati in **CC0 nel 2013** ⚠️; un articolo dell'AIB parla invece di CC BY 3.0 e dice che non ci sono strumenti per scarichi in blocco (data poco chiara) ⚠️. Da verificare la licenza attuale sul sito dell'OPAC | Non trovati. L'OPAC espone alcune API ⚠️                                                                | ⚠️                                             |
| Google Books                        | Categorie, editore, data, ISBN                                                                                                                     | **No per noi**: non puoi far pagare gli utenti senza un accordo con Google, né creare copie permanenti o una tua base dati, e la cache dura quanto l'intestazione di cache; va citato Google ✅. L'API "non sostituisce servizi commerciali" ✅      | Non cercati                                                                                             | ✅                                             |

## 6. Verdetto per un prodotto commerciale

**Utilizzabili, con le condizioni indicate**

- **Wikidata** (CC0).
- **Open Library** (metadati dichiarati liberi, da prendere con i dump mensili).
- **Metron** (CC BY-SA 4.0, con attribuzione e verifica della ShareAlike).
- **Catalogo SBN** (CC0 secondo la delibera del 2013, da riconfermare).
- **ISBNdb** (a pagamento, con licenza commerciale).
- **Cataloghi degli editori** (con accordo).

**Con licenza o autorizzazione scritta**

- **AniList**: licenza commerciale sopra i 150 $ al mese, e comunque non per archiviare i dati. Va chiesto un permesso esplicito per l'archivio.
- **MyAnimeList/Jikan**: autorizzazione di MAL.
- **MangaUpdates** e **Kitsu**: da chiedere.
- **Grand Comics Database**: da chiedere (i termini si contraddicono).
- **Comic Vine**: solo per un'eccezione concessa dai gestori.

**Da escludere per il prodotto commerciale**

- **MangaDex** (vieta il lucro).
- **Google Books** (vieta la base dati propria e le copie permanenti).
- Il piano accademico di ISBNdb.

**Le copertine sono un tema a parte.** Nessuna licenza dei dati le comprende: Metron e GCD le ospitano come "fair use" ✅. Oggi l'app mostra le copertine: per un prodotto commerciale vanno ottenute dagli editori (o da un servizio con licenza), non copiate dai link delle banche dati.

## 7. Come importare rispettando i limiti

Servono un back-end e una base dati, che oggi non ci sono (ci sono solo i `TODO(api)`).

1. **Prima di tutto, scegliere il modello:**
   - **Base dati nostra** (consigliato): si importa una volta, si aggiorna a intervalli e si risponde dai nostri server. Funziona con le fonti che lo permettono (Wikidata, Open Library, Metron, ISBNdb, SBN, editori).
   - **Interrogazione in tempo reale**: si chiama la fonte a ogni richiesta. È quello che AniList e MAL tollerano di più, ma con 90 e 60 richieste al minuto non regge i filtri di un catalogo intero.
2. **Importazione delle opere.** Un job periodico legge Wikidata (dump o SPARQL), Metron e, se si ottiene la licenza, AniList o MAL, converte i valori con le tabelle di questa pagina e salva l'opera con la sua fonte.
3. **Importazione delle edizioni.** Dai cataloghi degli editori, da ISBNdb (editore, legatura, lingua, pagine), dai dump di Open Library e dal catalogo SBN: ISBN, editore italiano, numero del volume, edizione speciale.
4. **Collegamento opera ↔ edizione.** All'inizio con una persona che conferma (titolo e autore uguali, ISBN noto); le regole automatiche vengono dopo.
5. **Rispettare i limiti:**
   - grandi quantità solo con i dump (Open Library lo chiede espressamente; per Wikidata sono la via giusta);
   - API con un User-Agent che identifica l'app e un contatto (Open Library passa da 1 a 3 richieste al secondo);
   - ritardo crescente se arriva un errore 429; in caso di blocco (MangaDex, Wikidata) si smette e si riprova più tardi;
   - cache locale, ma solo dove la licenza la consente (ISBNdb: finché l'abbonamento è attivo).
6. **Tabelle di conversione modificabili.** Temi, categorie e formati stanno in una tabella, non nel codice.
7. **Provenienza, licenza e attribuzione per campo**, come in `sources` qui sotto. Una pagina "Crediti" nell'app con le attribuzioni richieste (Metron, Wikidata se la si vuole citare, ISBNdb e le altre).
8. **Classificazione nostra.** Categorie dei fumetti, fascia d'età (compresa la violenza) e collegamenti sono lavoro editoriale: vanno previsti nei tempi.

### Campi da aggiungere a `ComicItem`

```ts
// Proposta: i nomi e i valori vanno confermati
interface ComicItem {
  // già presenti: id, title, author, volume, totalVolumes, isSingleVolume, editionType, coverUrl
  type: 'manga' | 'comic';
  categories: string[]; // demografiche (manga) o generi (fumetti)
  format: string; // 'Serie' | 'One-shot' | 'Graphic novel' | 'Omnibus'
  year: number; // anno dell'opera, o dell'edizione: da decidere
  themes: string[]; // manga: temi narrativi
  publisher: string; // editore dell'edizione italiana
  ageRating: 'all' | 'teen' | 'adult';
  sources: { field: string; source: string; license: string; fetchedAt: string }[];
}
```

Il campo `sources` registra per ogni dato la fonte, la licenza e la data: serve per citare chi lo chiede, per aggiornare e per cancellare i dati di una fonte se la licenza cambia (per esempio se scade un abbonamento).

## 8. Cosa verificare prima di scegliere

1. **AniList**: leggere il testo completo dei termini e scrivere a contact@anilist.co chiedendo se un archivio di metadati per i filtri è consentito con la licenza commerciale.
2. **MyAnimeList/Jikan**: leggere i termini di Jikan e chiedere a MAL l'autorizzazione scritta.
3. **Metron**: leggere il post "Using Metron in Commercial Software" e confrontarlo con la ShareAlike: mostrare i dati agli utenti dell'app è "distribuzione"? Far valutare a un legale.
4. **Grand Comics Database**: scrivere al progetto, perché i termini si contraddicono.
5. **Catalogo SBN**: confermare la licenza attuale dei record sul sito dell'OPAC.
6. **ISBNdb**: provare la copertura delle edizioni italiane di manga e fumetti (editore e legatura) con il periodo di prova gratuito di 7 giorni.
7. **MangaUpdates, Kitsu**: chiedere i termini.
8. **Elenchi ufficiali** di generi e tag di AniList e di Jikan, per fissare la tabella dei temi, e se Kodomo è coperto.
9. **Categorie e temi del documento**: completare gli identificativi dei generi su Wikidata e controllare le opere senza voce (sezione 9.8).

## 9. Categorie e temi del documento: dati veri, fonte e cosa manca

**Stato:** il documento Google non è raggiungibile, ma mi hai mandato il testo delle «5 Categorie Principali» e della tabella «Tema narrativo» come immagini. Qui ogni categoria e ogni tema è cercato come **dato vero su una fonte libera per l'uso commerciale**. Le ricerche hanno restituito pagine di Wikidata (dati CC0 ✅) e della Library of Congress; MAL e AniList non sono usciti. «Non visto» significa che il dato non compariva nei risultati, non che non esista.

### 9.1 In breve

- **Fonte consigliata: Wikidata.** I dati sono CC0 (uso commerciale libero ✅, vedi sezione 5.2). Ha le voci per tutte e 5 le categorie e per **tutti i 10 temi**.
- **Categorie:** tutte e 5 esistono come elementi. Kodomo si chiama «children's manga» (nome alternativo «kodomomuke manga»).
- **Temi:** tutti hanno una voce. Lo **Sport** è «[spokon, Q2281511](https://www.wikidata.org/wiki/Q2281511)» ✅ (genere di anime e manga, sottoclasse della narrativa sportiva; il documento stesso nomina lo spokon). Il guaio è la coerenza: Haikyu!! risulta etichettato spokon, ma Kuroko's Basketball e Slam Dunk no sull'opera principale ✅.
- **La difficoltà è la copertura per opera**: per molte opere del documento Wikidata non mostra la demografia o non ha un elemento (vedi 9.4). Per quelle serve la rivista di serializzazione o una classificazione nostra.
- Le **descrizioni brevi** della tabella del documento sono testi di Komixy: si usano come sono. Non vanno copiate dalle pagine di Wikipedia (CC BY-SA).

### 9.2 Le 5 categorie: fonte e voce

| Categoria (documento) | Voce su Wikidata (CC0)                                                                                      | Trovata?                  | Note                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Shōnen (少年)         | [shōnen, Q231302](https://www.wikidata.org/wiki/Q231302) ✅ «manga marketed primarily to adolescent boys»   | Sì                        | Valore della proprietà «pubblico di destinazione» (P2360)                                                        |
| Shōjo (少女)          | [shōjo, Q242492](https://www.wikidata.org/wiki/Q242492) ✅                                                  | Sì                        |                                                                                                                  |
| Seinen (青年)         | [seinen, Q237338](https://www.wikidata.org/wiki/Q237338) ✅ «18 anni e oltre»                               | Sì                        |                                                                                                                  |
| Josei (女性)          | [josei, Q503106](https://www.wikidata.org/wiki/Q503106) ✅                                                  | Sì                        | C'è anche la classe delle riviste: [josei manga magazine, Q24826340](https://www.wikidata.org/wiki/Q24826340) ✅ |
| Kodomo (子供)         | [children's manga, Q478804](https://www.wikidata.org/wiki/Q478804) ✅ (nome alternativo «kodomomuke manga») | **Sì, con un altro nome** | Il documento dice «Kodomo»: l'etichetta cambia. Va mappato a mano                                                |

**Library of Congress (alternativa libera, solo per i nomi).** Il termine «Manga» (genere/forma) ha come termini più specifici Seinen manga, Shōjo manga, Shōnen manga, Isekai manga, Yuri manga e Boys love ✅. **Josei e Kodomo non li ho trovati** ❌. È un vocabolario per le biblioteche, non un elenco di opere: serve a normalizzare i nomi, non a classificare i volumi. La licenza d'uso non l'ho letta: l'ente è pubblico, ma da confermare ⚠️.

### 9.3 I 10 temi: fonte e voce

| Tema (documento)   | Voce su Wikidata (CC0)                                                                                                                                                                                                         | Trovato? | Note                                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Azione / Avventura | «action anime and manga» ✅ e «adventure anime and manga» ✅ (elementi di genere; identificativi da cercare)                                                                                                                   | Sì       | Due voci per un tema                                                                                                                                                                                                                                         |
| Romance            | «romance anime and manga» ✅ e «romantic comedy anime and manga» ✅                                                                                                                                                            | Sì       | La commedia romantica va unita al tema Romance                                                                                                                                                                                                               |
| Fantasy            | «fantasy anime and manga» ✅                                                                                                                                                                                                   | Sì       |                                                                                                                                                                                                                                                              |
| Sci-fi / Mecha     | «science fiction anime and manga» ✅ e [mecha, Q4292083](https://www.wikidata.org/wiki/Q4292083) ✅ (sottogeneri: super robot Q988964, real robot Q3129804)                                                                    | Sì       | Il mecha è una sottoclasse della fantascienza ✅                                                                                                                                                                                                             |
| Horror             | «horror anime and manga» ✅; genere generico [horror fiction, Q16575965](https://www.wikidata.org/wiki/Q16575965) ✅                                                                                                           | Sì       |                                                                                                                                                                                                                                                              |
| Mystery / Giallo   | «mystery anime and manga» ✅; genere generico [mystery fiction, Q6585139](https://www.wikidata.org/wiki/Q6585139) ✅                                                                                                           | Sì       |                                                                                                                                                                                                                                                              |
| Commedia           | «comedy anime and manga» ✅                                                                                                                                                                                                    | Sì       |                                                                                                                                                                                                                                                              |
| Sport              | [spokon, Q2281511](https://www.wikidata.org/wiki/Q2281511) ✅ (nome giapponese スポ根; collegato alla categoria «Sports anime and manga»); sottoclasse [baseball manga, Q11116488](https://www.wikidata.org/wiki/Q11116488) ✅ | **Sì**   | Etichettate spokon: One Outs, Giant Killing, Ace of Diamond, Hanebado!, Medalist, Ahiru no Sora, Hoopmen ✅. **Non uniforme**: Kuroko's Basketball e Slam Dunk non l'hanno sull'opera principale, quindi serve anche la regola «soggetto principale = sport» |
| Slice of life      | «slice of life anime and manga» ✅; sottogenere [iyashikei, Q97358333](https://www.wikidata.org/wiki/Q97358333) ✅                                                                                                             | Sì       |                                                                                                                                                                                                                                                              |
| Isekai             | [isekai, Q53911753](https://www.wikidata.org/wiki/Q53911753) ✅ (genere di anime e manga, sottoclasse del portal fantasy). Anche LoC: «Isekai manga» ✅                                                                        | Sì       | Unica voce con un nome diverso in giapponese (異世界) già presente                                                                                                                                                                                           |

Le voci di genere di Wikidata sono raccolte dal progetto [Anime e Manga](https://www.wikidata.org/wiki/Wikidata:WikiProject_Anime_and_Manga) ✅ (classe [anime and manga genre, Q4178140](https://www.wikidata.org/wiki/Q4178140) ✅), con una nota sullo stato dei lavori datata (circa 800 giorni): va riconfermata.

### 9.4 Le 21 opere d'esempio del documento su Wikidata

| Opera                   | Voce Wikidata                                                               | Categoria vista                                            | Tema o generi visti                                                                                                                                  | Esito                                                                         |
| ----------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| One Piece               | [Q28667972](https://www.wikidata.org/wiki/Q28667972) ✅                     | Shōnen ✅ (rivista Weekly Shōnen Jump)                     | Azione, fantasy, avventura, commedia drammatica, pirati ✅                                                                                           | **Coincide** con Azione / Avventura                                           |
| Dragon Ball             | [Q15051307](https://www.wikidata.org/wiki/Q15051307) ✅                     | Shōnen ✅                                                  | Avventura ✅                                                                                                                                         | Coincide                                                                      |
| Naruto                  | Voce principale non uscita ❌ (visto un derivato: shōnen)                   | Shōnen (solo derivato)                                     | Non visti                                                                                                                                            | Da controllare                                                                |
| Pokémon                 | [Pokémon Adventures, Q964721](https://www.wikidata.org/wiki/Q964721) ✅     | Shōnen e «children's manga» ✅                             | Fantasy ✅                                                                                                                                           | Coincide con Kodomo (e anche Shōnen)                                          |
| Doraemon                | [Q235311](https://www.wikidata.org/wiki/Q235311) ✅                         | «children's manga» e shōnen (proprietà non confermata)     | Non visti                                                                                                                                            | Parziale                                                                      |
| Sailor Moon             | [Q1643098](https://www.wikidata.org/wiki/Q1643098) ✅                       | Shōjo ✅ (rivista Nakayoshi)                               | Magical girl ✅                                                                                                                                      | Coincide                                                                      |
| Fruits Basket           | [Q216204](https://www.wikidata.org/wiki/Q216204) ✅                         | Non vista ❌ (su Wikipedia: rivista shōjo)                 | Commedia romantica, slice of life, soprannaturale ✅                                                                                                 | Tema Romance coincide; categoria da ricavare dalla rivista                    |
| Nana                    | [Q423658](https://www.wikidata.org/wiki/Q423658) ✅                         | **Shōjo** ✅ (editore Ribon Mascot Comics; rivista Cookie) | Non visti                                                                                                                                            | **Coincide con Shōjo**; come Josei **no** (il documento la mette in entrambe) |
| Berserk                 | [Q18558978](https://www.wikidata.org/wiki/Q18558978) ✅                     | Non vista ❌ (su Wikipedia: seinen)                        | Azione, dark fantasy, high fantasy, sword and sorcery ✅                                                                                             | Categoria da ricavare dalla rivista                                           |
| Monster                 | [Q858384](https://www.wikidata.org/wiki/Q858384) ✅                         | Non vista ❌                                               | Horror, mystery, psicologico, thriller, crimine ✅                                                                                                   | Categoria da ricavare                                                         |
| Akira                   | [Q91486](https://www.wikidata.org/wiki/Q91486) ✅                           | Non vista ❌                                               | Fantascienza, cyberpunk ✅                                                                                                                           | Categoria da ricavare                                                         |
| Paradise Kiss           | [Q651753](https://www.wikidata.org/wiki/Q651753) ✅                         | Josei ✅                                                   | Non visti                                                                                                                                            | Coincide                                                                      |
| Chihayafuru             | [Q182469](https://www.wikidata.org/wiki/Q182469) ✅                         | Josei ✅                                                   | Slice of life ✅ (il documento la mette tra le josei; lo sport non c'è)                                                                              | Coincide                                                                      |
| Fairy Tail              | **Voce non uscita** ❌                                                      | Non vista                                                  | Non visti                                                                                                                                            | **Non trovata**                                                               |
| Neon Genesis Evangelion | [Q1977621](https://www.wikidata.org/wiki/Q1977621) ✅ (manga: genere mecha) | Non vista (derivati: shōjo)                                | Mecha ✅                                                                                                                                             | Coincide con Sci-fi / Mecha                                                   |
| Tokyo Ghoul             | [Q11102941](https://www.wikidata.org/wiki/Q11102941) ✅                     | Non vista (Wikipedia: rivista seinen)                      | **Horror** ✅, thriller, dark fantasy, thriller soprannaturale                                                                                       | **Coincide con Horror**                                                       |
| Detective Conan         | **Voce della serie non uscita** ❌                                          | Non vista                                                  | Non visti (Wikipedia francese: mystery, thriller, whodunit)                                                                                          | **Non trovata su Wikidata**                                                   |
| Gintama                 | [Q764135](https://www.wikidata.org/wiki/Q764135) ✅                         | Non vista                                                  | Commedia, fantascienza ✅                                                                                                                            | Coincide con Commedia                                                         |
| Haikyu!!                | [Q326642](https://www.wikidata.org/wiki/Q326642) ✅                         | Non vista (rivista Weekly Shōnen Jump)                     | Commedia drammatica, coming-of-age, commedia ✅ e, secondo la ricerca più recente, **spokon** ✅ (da riconfermare: la prima ricerca non lo mostrava) | **Coincide con Sport** (da riconfermare)                                      |
| Barakamon               | [Q6579725](https://www.wikidata.org/wiki/Q6579725) ✅                       | Non vista                                                  | Slice of life ✅                                                                                                                                     | Coincide                                                                      |
| Re:Zero                 | [Q20718351](https://www.wikidata.org/wiki/Q20718351) ✅ (è il light novel)  | Non vista                                                  | Isekai ✅, dark fantasy, avventura                                                                                                                   | Isekai coincide, ma la voce è del light novel, non del manga                  |

**Riepilogo**

- **Coincidono con il documento: 14 opere su 21** (One Piece, Dragon Ball, Pokémon, Sailor Moon, Fruits Basket per il tema, Paradise Kiss, Chihayafuru, Evangelion, Tokyo Ghoul, Gintama, Barakamon, Re:Zero per Isekai, e Doraemon in parte).
- **Non coincide: 0.** Haikyu!! risulta ora etichettato «spokon» (Sport), da riconfermare.
- **Voce non trovata: 2** (Fairy Tail, Detective Conan come serie).
- **Categoria non vista, da ricavare dalla rivista: 5** (Berserk, Monster, Akira, Fruits Basket, Naruto principale).
- Dove l'unico risultato è «non visto» non vuol dire che il dato manchi: le ricerche mostrano solo una parte dei dati di ogni voce.

### 9.5 Cosa non trovo, in un elenco

**Categorie**

- Nessuna categoria è senza voce. L'unica con nome diverso è **Kodomo**, che su Wikidata è «children's manga».
- Su Library of Congress mancano **Josei** e **Kodomo** ❌.

**Temi**

- Nessuno: tutti i 10 hanno una voce. Lo **Sport** è «spokon» (Q2281511), ma non tutte le opere sportive la portano (Kuroko's Basketball e Slam Dunk no sull'opera principale).

**Opere d'esempio**

- Senza voce su Wikidata nei risultati: **Fairy Tail**, **Detective Conan** (serie). **Nana** ora è stata trovata (Q423658, pubblico: shōjo).
- Senza categoria visibile: **Berserk**, **Monster**, **Akira**, **Fruits Basket**, **Naruto** (principale).
- Senza il tema del documento: nessuna opera con certezza; da riconfermare Haikyu!! (Sport).

**Come colmare i vuoti, senza pagare né chiedere permessi**

1. **Categoria: prima il valore sull'opera, poi la rivista.** Il caso di Nana mostra il limite della rivista: Cookie è «josei» su alcune fonti e «shōjo» sul sito dell'editore (S-MANGA.NET) ✅, mentre Wikidata dà a Nana «shōjo» ✅. Quindi si usa prima il pubblico di destinazione dell'opera (P2360) e la rivista solo se manca.
2. **Categoria dalla rivista (se manca il valore sull'opera).** Wikidata riporta la rivista (One Piece → Weekly Shōnen Jump, Sailor Moon → Nakayoshi ✅) e ha la classe delle riviste (josei manga magazine Q24826340 ✅). Una tabella nostra rivista → categoria dà la demografia anche dove manca il valore sull'opera.
3. **Sport anche dal soggetto.** Dove l'opera non ha l'etichetta spokon ma ha come soggetto principale uno sport (pallavolo, basket, baseball ✅), si assegna il tema Sport con una regola nostra. Si unisce a: spokon, «baseball manga» e gli altri sottogeneri sportivi.
4. **Voci mancanti o errate** (Fairy Tail, Detective Conan): inserimento nostro. Possono anche essere aggiunte a Wikidata, che è aperta alle modifiche.
5. **Light novel contro manga.** Per Re:Zero la voce trovata è del light novel: serve prendere l'elemento del manga.

### 9.6 Come estrarre i dati da Wikidata (query di esempio, non eseguita qui)

```sparql
SELECT ?opera ?operaLabel ?genereLabel ?pubblicoLabel WHERE {
  ?opera wdt:P31 wd:Q21198342 .        # serie manga
  OPTIONAL { ?opera wdt:P136 ?genere . }   # genere
  OPTIONAL { ?opera wdt:P2360 ?pubblico . } # pubblico di destinazione
  SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
}
LIMIT 100
```

Per l'elenco completo conviene il dump di Wikidata (il servizio di interrogazione ha limiti di tempo per cliente, vedi sezione 5.2). Gli identificativi `P136` (genere) e `P2360` (pubblico di destinazione) sono confermati dalle pagine del progetto ✅; `Q21198342` è l'elemento «manga series» ✅.

### 9.7 Altro nel documento

Accanto a ogni categoria ci sono stringhe evidenziate in verde (`0x1ypt94`, `641r7p9y`, `dmsxkiz6,denwo0qc`, `ekd9qqx8` con la nota «usare questo seed»). Sembrano i seed degli avatar (libreria DiceBear): riguardano il front-end e non il catalogo. Seinen non ne ha e Shōjo ne ha due.

### 9.8 Per completare

1. Eseguire la query di 9.6 e le ricerche per `Q`-identificativo dei generi mancanti («action anime and manga», «romance anime and manga»…) sul sito di Wikidata: servono gli identificativi per scrivere la tabella di conversione.
2. Cercare a mano su Wikidata Fairy Tail e Detective Conan, e controllare la demografia di Naruto, Berserk, Monster, Akira e Fruits Basket.
3. Aggiungere i domini `www.wikidata.org` e `query.wikidata.org` a quelli raggiungibili dall'ambiente, se vuoi che lo faccia io: lo decidi tu.

## Fonti consultate

- AniList, termini e limiti: https://anilist.gitbook.io/anilist-apiv2-docs/docs/guide/terms-of-use · https://docs.anilist.co/guide/rate-limiting · https://anilist.gitbook.io/anilist-apiv2-docs/docs/guide/graphql/queries/media · https://anilist.notion.site/Format-Source-Material-and-Country-of-Origin-3ae74defdf724c56b2ffb1b967953de4
- Jikan e MAL: https://docs.api.jikan.moe/ · https://jikan.moe/ · discussione sull'accordo di MAL (terzi): https://github.com/Sherlock64/osusume/issues/12
- MangaDex: https://api.mangadex.org/docs/2-limitations/ · https://api.mangadex.org/docs/03-manga/search/
- MangaUpdates: https://www.mangaupdates.com/topic/4sw0ahm/mangaupdates-api-comments-suggestions-bugs · https://www.mangaupdates.com/topic/f0ghpti/mangaupdates-api-released
- Demografie, temi e generi: discussione sul forum di MAL: https://myanimelist.net/forum/message/64408507?goto=topic · https://myanimelist.net/forum/message/64441633?goto=topic · pagina dei generi dei manga di Jikan: https://docs.jikan.moe/classes/jikan-model-genre-mangagenrelist
- Wikidata, pubblico di destinazione: https://www.wikidata.org/wiki/Property:P2360 · https://www.wikidata.org/wiki/Wikidata_talk:WikiProject_Anime_and_Manga · https://www.wikidata.org/wiki/Q242492
- Opere e riviste (Wikipedia): https://en.wikipedia.org/wiki/Sh%C5%8Dnen_manga · https://en.wikipedia.org/wiki/Sh%C5%8Djo_manga · https://en.wikipedia.org/wiki/Nana_(manga) · https://en.wikipedia.org/wiki/Talk:Nana_(manga) · https://en.wikipedia.org/wiki/Fruits_Basket · https://en.wikipedia.org/wiki/Berserk_(manga) · https://en.wikipedia.org/wiki/Tokyo_Ghoul · https://en.wikipedia.org/wiki/Haikyu!! · https://fr.wikipedia.org/wiki/D%C3%A9tective_Conan · https://en.wikipedia.org/wiki/Barakamon
- Wikidata, voci di categorie, generi e opere: https://www.wikidata.org/wiki/Q231302 · https://www.wikidata.org/wiki/Q242492 · https://www.wikidata.org/wiki/Q237338 · https://www.wikidata.org/wiki/Q503106 · https://www.wikidata.org/wiki/Q478804 · https://www.wikidata.org/wiki/Q24826340 · https://www.wikidata.org/wiki/Q53911753 · https://www.wikidata.org/wiki/Q4292083 · https://www.wikidata.org/wiki/Q16575965 · https://www.wikidata.org/wiki/Q6585139 · https://www.wikidata.org/wiki/Q11116488 · https://www.wikidata.org/wiki/Q97358333 · https://www.wikidata.org/wiki/Q4178140 · https://www.wikidata.org/wiki/Q28667972 · https://www.wikidata.org/wiki/Q15051307 · https://www.wikidata.org/wiki/Q964721 · https://www.wikidata.org/wiki/Q235311 · https://www.wikidata.org/wiki/Q1643098 · https://www.wikidata.org/wiki/Q216204 · https://www.wikidata.org/wiki/Q18558978 · https://www.wikidata.org/wiki/Q858384 · https://www.wikidata.org/wiki/Q91486 · https://www.wikidata.org/wiki/Q651753 · https://www.wikidata.org/wiki/Q182469 · https://www.wikidata.org/wiki/Q1977621 · https://www.wikidata.org/wiki/Q11102941 · https://www.wikidata.org/wiki/Q764135 · https://www.wikidata.org/wiki/Q326642 · https://www.wikidata.org/wiki/Q6579725 · https://www.wikidata.org/wiki/Q20718351 · https://www.wikidata.org/wiki/Wikidata:WikiProject_Anime_and_Manga
- Sport / spokon: https://www.wikidata.org/wiki/Q2281511 · https://www.wikidata.org/wiki/Q11116488 · https://www.wikipedia.org/wiki/Sports_anime · https://www.eroicafenice.com/comics/cose-lo-spokon-storia-e-5-serie-consigliate/
- Library of Congress, termini di genere/forma: https://id.loc.gov/authorities/subjects/sh2022006465.html · https://authorities.loc.gov/authority/gf2022026036?searchFields=lccn
- Kitsu (nessun termine trovato): https://github.com/wopian/kitsu
- Comic Vine: https://comicvine.gamespot.com/api/ · https://comicvine.gamespot.com/forums/api-developers-2334/clarify-terms-of-use-2323234/ · https://comicvine.gamespot.com/forums/api-developers-2334/api-rate-limiting-1746419/
- Metron: https://metron-project.github.io/blog/commercial-api-use · https://github.com/Metron-Project/metron-project.github.io/pull/65 · https://metron-project.github.io/blog/api-best-practices
- Grand Comics Database: https://docs.comics.org/wiki/Data_Distribution · https://docs.comics.org/wiki/App_Guidelines · https://docs.comics.org/wiki/General_FAQ · https://www.comics.org/
- Open Library: https://openlibrary.org/developers/licensing · https://openlibrary.org/developers/dumps · https://openlibrary.org/developers/api · https://openlibrary.org/help/faq/using
- Wikidata: https://www.wikidata.org/wiki/Wikidata:Licensing · https://www.wikidata.org/wiki/Wikidata:Data_access · https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/Copyright
- ISBNdb: https://isbndb.com/isbn-database · https://isbndb.com/terms-and-conditions · https://isbndb.com/faq
- Google Books: https://developers.google.com/books/terms · https://developers.google.com/terms
- Catalogo SBN: https://www.iccu.sbn.it/documenti/OPAC/OPAC_SBN_Informazioni.pdf · https://www.iccu.sbn.it/export/sites/iccu/documenti/2014/CNC_SBN_Verb11-9-13/Relazione_CNC_11-9-2013.pdf · https://aib.it/cosa_sbn_dovrebbe_fare
