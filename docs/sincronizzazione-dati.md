# Tenere allineati i dati di Wikidata con il database di Komixy

Complemento di [`filtri-fonti-dati.md`](./filtri-fonti-dati.md): lì si spiega **quali** dati importare e da dove, qui **come tenerli aggiornati** nel database di Komixy. Il database è quello descritto in [`backend.md`](./backend.md) (SQL, dietro il backend; il frontend non lo raggiunge mai).

> Non verificato: Wikidata, AniList e gli altri domini sono bloccati nell'ambiente in cui è stato scritto il documento. Query, frequenze e limiti d'uso vanno provati e controllati nella documentazione ufficiale prima di usarli.

## Principio: copia locale, non specchio

Wikidata non si legge a ogni richiesta dell'app: si **importa** in tabelle di Komixy e l'app legge solo da quelle. Il job di sincronizzazione è un processo separato dal backend che serve l'app.

- Un'interruzione di Wikidata non ferma l'app.
- I filtri funzionano con query SQL veloci.
- I dati si possono correggere senza toccare Wikidata.

## 1. Tabelle (esempio, da adattare)

```sql
-- opere/serie e volumi: gli id di Komixy restano la chiave
works(id, title, ..., created_at, updated_at)

-- legame con la fonte
external_ids(
  work_id, source,            -- 'wikidata', 'anilist', ...
  external_id,                -- es. 'Q423658'
  last_revid, source_modified_at, synced_at,
  status,                     -- 'active' | 'redirected' | 'deleted'
  PRIMARY KEY (source, external_id)
)

-- da dove viene ogni campo
field_sources(work_id, field, source, license, fetched_at)

-- correzioni di Komixy che la sincronizzazione non può sovrascrivere
overrides(work_id, field, value, author, created_at)

-- modifiche in attesa di controllo (vedi «Vandalismo»)
staging_changes(work_id, field, old_value, new_value, source, fetched_at, status)
```

Il legame è `external_ids`: collega l'`id` di Komixy al QID. Il titolo non è mai una chiave (cambia e si ripete tra edizioni).

## 2. Rilevare cosa è cambiato

| Metodo                                | Come                                                                                                                                         | Quando                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Per revisione**                     | API `wbgetentities` (`props=info`, più QID per chiamata): si confronta `lastrevid` con quello salvato e si riscaricano solo gli item diversi | Consigliato a regime                                                              |
| **SPARQL con `schema:dateModified`**  | Query sugli item del perimetro modificati dopo l'ultima esecuzione                                                                           | Comodo, ma il Query Service ha qualche minuto di ritardo e un timeout sulle query |
| **Dump (settimanale o incrementale)** | Si scarica il file, si filtrano i QID di Komixy e si fa il diff                                                                              | Primo import e ricontrolli periodici; è pesante                                   |

Ipotesi di partenza (da validare): job **notturno** per `lastrevid` e controllo completo **mensile** con il dump. La scelta definitiva dipende da quante opere si importano.

## 3. Regole

1. **Upsert idempotente.** Una riesecuzione o un'interruzione a metà non duplica né rovina nulla: aggiornamento in transazione con la chiave `(source, external_id)`.
2. **Un campo ha un solo proprietario.** Se c'è una riga in `overrides`, vince e la sincronizzazione salta il campo; altrimenti vince la fonte. Così una correzione dell'editor non sparisce il giorno dopo.
3. **Redirect e fusioni.** Se un QID viene unito a un altro, l'item vecchio risponde con un redirect: si segna `redirected`, si sposta il legame sul QID nuovo e, se ora due opere di Komixy puntano allo stesso QID, si uniscono a mano.
4. **Cancellazioni.** Se un item sparisce non si cancella l'opera di Komixy (le liste degli utenti la referenziano): `status='deleted'` e revisione manuale.
5. **Vandalismo.** Wikidata la modifica chiunque. I campi sensibili (titolo, copertina, genere, pubblico) finiscono in `staging_changes` e passano solo se superano controlli automatici (es. il genere è in una lista nota) o dopo approvazione. I campi minori (anno, numero di volumi) si possono applicare in automatico.
6. **Tracciabilità.** Ogni campo importato scrive una riga in `field_sources` con fonte, licenza e data: serve per le attribuzioni richieste e per capire da dove viene un dato.
7. **Limiti d'uso.** `User-Agent` con un contatto dell'applicazione (non personale), poche richieste in parallelo, pause tra i lotti.
8. **Monitoraggio.** Il job registra item letti, aggiornati, messi in staging ed errori; un allarme scatta se per più giorni non aggiorna nulla.

## 4. Dove gira

In un servizio separato dal backend dell'app (script con cron dell'hosting o funzione pianificata). Non insieme al frontend su Vercel, che non è pensato per job lunghi. Il database resta quello dietro il backend.

## 5. Da decidere

- Quante opere si importano (decide tra confronto per `lastrevid` e SPARQL).
- Dove gira il job pianificato: `backend.md` non ne parla.
- Chi approva le modifiche in `staging_changes` e con quali criteri.
- Una volta aggiunto il catalogo, collegare queste tabelle ai campi di `ComicItem` (`sources` incluso) descritti in `filtri-fonti-dati.md`.
