# ---------------------------------------------------------------------------
# test_news.py: il test della funzione parse_feed, definita in app/news.py.
#
# RUOLO: verifica che parse_feed faccia bene il suo lavoro. È un test "unitario":
# controlla un solo pezzo di codice, in isolamento. parse_feed è una funzione "pura":
# riceve testo XML e restituisce una lista di articoli, senza toccare DB o rete.
#
# COME SI ESEGUE: dalla cartella apps/api con "pytest -q tests/test_news.py", oppure
# con tutta la suite (vedi CLAUDE.md). Pytest trova da solo i file "test_*.py" e le
# funzioni "test_*" al loro interno: non serve registrarle da nessuna parte.
#
# CONCETTI USATI:
# - Test automatico: una funzione "test_..." non restituisce nulla. Se un "assert"
#   fallisce, il test risulta rosso; altrimenti verde.
#   (Analogia Laravel/PHP: come un metodo test_... in PHPUnit.)
# - assert: "assert condizione" verifica che la condizione sia vera. Se è falsa, il test
#   si ferma e mostra cosa non torna. Doc: https://docs.pytest.org/en/stable/how-to/assert.html
# - Byte: il prefisso b"..." crea una sequenza di byte (dati grezzi), non testo normale.
#   È il formato in cui arriva il corpo di una risposta HTTP.
# - Nessuna rete: il feed è scritto a mano qui dentro. Così il test è veloce, ripetibile
#   e non dipende da siti esterni che possono cambiare o essere offline.
# - Doc pytest: https://docs.pytest.org/en/stable/
#
# NOTA: il test controlla solo l'anno della data, quindi non vede il problema di fuso
# orario segnalato in app/news.py (mktime tratta la data come ora locale).
# ---------------------------------------------------------------------------

from app.news import parse_feed

# RSS: il "feed finto" usato dal test. RSS è un formato XML (testo con tag <...>) con cui i
# siti pubblicano l'elenco dei loro articoli. Struttura: <rss> è la radice, <channel> il
# contenitore, poi c'è un <item> per ogni articolo con <title> (titolo), <link> (URL),
# <description> (riassunto) e <pubDate> (data). Ogni item serve a coprire un caso:
#   - primo item: titolo con tag HTML (<b>), riassunto con <p> e spazi multipli, data valida;
#   - secondo item ("Dup"): stesso link del primo, quindi deve essere scartato come duplicato;
#   - terzo item ("No date"): nessuna data, quindi published_at deve valere None.
# Doc RSS 2.0: https://www.rssboard.org/rss-specification
# I commenti Python NON possono stare dentro le virgolette b"""...""": diventerebbero dati
# del feed. Per questo sono qui sopra.
# La costante si chiama RSS in maiuscolo: per convenzione Python, è un valore fisso.
RSS = b"""<?xml version="1.0"?><rss version="2.0"><channel><title>T</title>
<item><title>First &lt;b&gt;post&lt;/b&gt;</title><link>https://ex.com/1</link>
<description>&lt;p&gt;Hello   world&lt;/p&gt;</description>
<pubDate>Mon, 19 Oct 2026 08:00:00 GMT</pubDate></item>
<item><title>Dup</title><link>https://ex.com/1</link></item>
<item><title>No date</title><link>https://ex.com/2</link></item>
</channel></rss>"""


# Il test vero e proprio. "def" definisce una funzione; il nome inizia con test_ così pytest
# la esegue. Il nome dice cosa verifica: il parsing pulisce i testi ed elimina i duplicati.
def test_parse_feed_cleans_and_dedupes():
    # Chiamiamo la funzione da testare passando il feed (byte) e il nome della fonte "Example".
    # items riceve la lista di dizionari restituita: uno per ogni articolo valido.
    items = parse_feed(RSS, "Example")
    # Controlliamo gli URL in ordine: il duplicato "Dup" (stesso link del primo) è sparito.
    # [i["url"] for i in items] è una "list comprehension": crea una lista con l'URL di ogni
    # articolo, letto dal campo "url" di ciascun dizionario.
    assert [i["url"] for i in items] == ["https://ex.com/1", "https://ex.com/2"]
    # Il titolo "First <b>post</b>" è stato ripulito dai tag HTML: resta "First post".
    # items[0] è il primo elemento della lista (gli indici partono da 0).
    assert items[0]["title"] == "First post"
    # Il riassunto "<p>Hello   world</p>" diventa "Hello world": tag tolti, spazi ridotti a uno.
    assert items[0]["excerpt"] == "Hello world"
    # La data è diventata un oggetto datetime; .year ne legge l'anno (2026).
    assert items[0]["published_at"].year == 2026
    # Il secondo articolo non ha una data: il valore deve essere None
    # (il "nulla" di Python; in PHP sarebbe null).
    assert items[1]["published_at"] is None
    # all(...) vuole che la condizione sia vera per TUTTI gli elementi: ogni articolo
    # deve avere source uguale a "Example". "i" è ciascun dizionario della lista.
    assert all(i["source"] == "Example" for i in items)
