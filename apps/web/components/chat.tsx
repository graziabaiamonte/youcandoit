"use client";

/*
 * ============================================================================
 * components/chat.tsx: la chat "RAG" riutilizzabile (domanda -> risposta con fonti)
 * ============================================================================
 * RAG = Retrieval-Augmented Generation. Il backend cerca prima i pezzi di testo utili
 * (articoli salvati, fonti della lezione), poi chiede all'AI di rispondere USANDO quei
 * pezzi e citandoli. Questo file e' solo la parte visibile: raccoglie la domanda, la invia
 * e mostra la risposta con le fonti cliccabili.
 *
 * DOVE SI USA (verificato con grep):
 *  - components/tutor-sheet.tsx: il pannello "Ask the tutor" dentro una lezione.
 *    Usa endpoint "/ai/tutor" e passa il session_id tramite extraBody.
 *  - app/news/page.tsx: il riquadro "chiedi alla tua reading list". Usa endpoint "/ai/ask".
 *  Entrambi gli endpoint sono in apps/api/app/routes/ai.py e rispondono { answer, citations }.
 *
 * FLUSSO: l'utente scrive -> send() -> api() (lib/api.ts) -> fetch("/api/ai/...") ->
 * proxy app/api/[...path]/route.ts -> FastAPI -> risposta -> setMessages() -> ridisegno.
 *
 * CONCETTI (Next.js 16.4 e React 19, documentazione ufficiale):
 *  - "use client" (la riga in cima): dice a Next.js che questo file gira nel BROWSER,
 *    perche' usa stato ed eventi (onClick, onChange). In Next.js i componenti sono di
 *    default Server Components, che non possono usare useState. Guida:
 *    https://nextjs.org/docs/app/getting-started/server-and-client-components
 *  - useState (React): crea uno stato. Quando lo cambi, React ridisegna il componente.
 *    https://react.dev/reference/react/useState
 *  - Props: i parametri del componente, es. <Chat endpoint="..." placeholder="..." />.
 *  - Componente "controllato": il testo del campo vive in React (value + onChange).
 *  - Nessuna memoria sul server: ad ogni domanda si rimanda tutta la storia (history),
 *    perche' il backend non ricorda le richieste precedenti.
 *  - Markdown: ReactMarkdown mostra il testo dell'AI formattato e, di default, non
 *    renderizza HTML grezzo.
 *
 * Riferimenti generali: https://react.dev/  e  https://nextjs.org/docs
 */

// Importazioni: ogni "import" porta dentro codice che questo file usa.
// useState: hook di React che crea uno "stato", cioe' una memoria che fa ridisegnare il componente.
import { useState } from "react";
// Converte il testo Markdown (grassetti, elenchi, blocchi di codice) in elementi HTML.
import ReactMarkdown from "react-markdown";
// Icone SVG dalla libreria lucide-react: Loader2Icon = rotellina, SendIcon = aeroplanino.
import { Loader2Icon, SendIcon } from "lucide-react";
// Componenti grafici di shadcn/ui: il codice sta in components/ui/ dentro il progetto.
// "@/" e' un alias che indica la radice di apps/web (evita percorsi tipo ../../).
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// Funzione api (lib/api.ts) per chiamare il backend. "type" davanti a un nome importa solo il
// TIPO (etichetta per TypeScript): sparisce a runtime, serve solo al controllo del codice.
import { api, type Answer, type Turn } from "@/lib/api";

// "type" crea un nuovo nome per un tipo. "&" unisce due tipi: un Message e' un Turn
// (ruolo + testo) con in piu' le citazioni, che sono opzionali (?).
// Answer["citations"] = il tipo del campo citations di Answer.
type Message = Turn & { citations?: Answer["citations"] };

// Funzione componente: restituisce JSX (HTML dentro JavaScript). Il nome con la maiuscola
// (Chat) dice a React che e' un componente da usare come tag: <Chat ... />.
/** RAG chat: sends the question + history to `endpoint` and shows cited answers. */
export function Chat({
  // Props: sono i parametri passati dall'esterno. Qui le "scomponiamo" (destructuring)
  // in variabili locali. endpoint = URL del backend che risponde.
  endpoint,
  // extraBody = dati extra da inviare con la domanda; = {} e' il valore di default (nessuno).
  extraBody = {},
  // placeholder = testo di esempio mostrato dentro il campo vuoto.
  placeholder,
  // suggestions = domande pronte da cliccare; = [] e' il default (nessuna).
  suggestions = [],
  // Dopo "}: {" inizia il TIPO delle props (TypeScript): cosa accetta il componente.
}: {
  // string = testo; il punto interrogativo (?) rende la prop opzionale.
  endpoint: string;
  // Record<string, string> = oggetto con chiavi e valori di testo.
  extraBody?: Record<string, string>;
  placeholder: string;
  suggestions?: string[];
}) {
  // Hook useState: restituisce [valoreAttuale, funzionePerCambiarlo]. Con "const [a, b] = ..."
  // prendiamo i due elementi della lista. <Message[]> = tipo: lista di Message.
  // [] = valore iniziale: la chat parte vuota.
  const [messages, setMessages] = useState<Message[]>([]);
  // Testo che l'utente sta scrivendo nel campo (stringa vuota all'inizio).
  const [input, setInput] = useState("");
  // true mentre aspettiamo la risposta: blocca nuovi invii e mostra l'indicatore di attesa.
  const [pending, setPending] = useState(false);
  // Messaggio d'errore da mostrare in rosso; stringa vuota = nessun errore.
  const [error, setError] = useState("");

  // send = la funzione che fa tutto il lavoro di una domanda. "async" = contiene attese (await)
  // di risposte dalla rete. Viene chiamata dal form, dal tasto Invio e dai suggerimenti.
  async function send(question: string) {
    // Esce subito (return) se la domanda e' vuota o solo spazi (trim) oppure se stiamo ancora
    // aspettando la risposta precedente (pending). "||" significa "oppure".
    if (!question.trim() || pending) return;
    // Storia della chat da rimandare al backend. map() crea una lista nuova: da ogni messaggio
    // tiene solo ruolo e testo ({ role, content }), scartando le citazioni.
    const history: Turn[] = messages.map(({ role, content }) => ({ role, content }));
    // Mostra SUBITO la domanda nella chat, senza aspettare il server (sembra piu' veloce).
    // setX con una funzione: m = lista attuale; [...m, nuovo] = copia della lista piu' il nuovo.
    setMessages((m) => [...m, { role: "user", content: question }]);
    // Svuota il campo di testo.
    setInput("");
    // Accende l'attesa (mostra "Thinking...", spegne il bottone) e cancella l'errore precedente.
    setPending(true);
    setError("");
    // try = "prova a fare questo"; se qualcosa lancia un errore, il blocco catch lo gestisce.
    try {
      // Chiama il backend con POST (invio di dati). "...extraBody" copia le chiavi di extraBody
      // dentro il nuovo oggetto (spread). <Answer> = la risposta ha la forma del tipo Answer.
      const res = await api<Answer>(endpoint, { method: "POST", body: { ...extraBody, question, history } });
      // Aggiunge la risposta dell'AI alla chat, insieme alle sue fonti (citations).
      setMessages((m) => [...m, { role: "assistant", content: res.answer, citations: res.citations }]);
    } catch (e) {
      // e = l'errore. "as Error" dice a TypeScript di trattarlo come Error (per leggere .message).
      setError((e as Error).message);
    } finally {
      // finally viene eseguito SEMPRE, con successo o con errore: spegne lo stato di attesa.
      setPending(false);
    }
  }

  // return = cosa mostrare. Il blocco tra parentesi e' JSX: HTML scritto dentro JavaScript.
  // In JSX si scrive className al posto di class (class e' una parola riservata di JavaScript).
  // Stile Tailwind: ogni parola e' una classe CSS. flex-col = colonna; gap-3 = spazio fra i figli.
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Area dei messaggi: flex-1 = spazio libero; overflow-y-auto = scorre se piena. */}
      {/* aria-live="polite": gli screen reader leggono i nuovi messaggi senza interrompere. */}
      {/* data-testid: etichetta per i test automatici (Playwright) per trovare questo punto. */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite" data-testid="chat-log">
        {/* Suggerimenti: compaiono SOLO quando la chat e' vuota. !messages.length = lista vuota.
            Con && React disegna il blocco solo se la parte a sinistra e' vera. */}
        {!messages.length && (
          // Colonna di pulsanti; space-y-2 = spazio verticale tra un pulsante e l'altro.
          <div className="space-y-2">
            {/* .map() = "per ogni elemento della lista, disegna questo" (modo standard). */}
            {suggestions.map((s) => (
              // key = identificatore unico di ogni elemento della lista; aiuta React a aggiornarla.
              // type="button" = il click non invia moduli; onClick = al click chiama send(s).
              // block/w-full = larghezza piena; border/p-3 = bordo e spazio interno.
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="block w-full rounded-lg border bg-muted/40 p-3 text-left text-sm hover:border-primary/50"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {/* Lista dei messaggi: .map() disegna un elemento per ogni messaggio della chat. */}
        {messages.map((m, i) =>
          // Operatore ternario "condizione ? se_vero : se_falso": messaggio dell'utente = bolla
          // semplice, altrimenti = risposta dell'AI (con Markdown e fonti).
          m.role === "user" ? (
            // Bolla dell'utente. ml-8 = margine a sinistra (sta a destra); bg-primary = colore.
            // key={i} = identificatore della riga (l'indice va bene: la chat cresce solo in coda).
            <p key={i} className="ml-8 rounded-xl rounded-br-sm bg-primary p-3 text-sm text-primary-foreground">
              {/* {m.content} inserisce nel JSX il testo del messaggio, tra graffe. */}
              {m.content}
            </p>
          ) : (
            // Bolla dell'AI. mr-4 = margine a destra (sta a sinistra), bg-muted = sfondo grigio.
            // data-testid="chat-answer" = etichetta per i test automatici.
            <div key={i} className="mr-4 space-y-2 rounded-xl rounded-bl-sm bg-muted p-3 text-sm" data-testid="chat-answer">
              {/* Testo della risposta come Markdown. Le classi [&_code]:... sono varianti Tailwind
                  arbitrarie: applicano lo stile agli ELEMENTI FIGLI (codice, liste, blocchi). */}
              <div className="prose-sm space-y-2 leading-relaxed [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_li]:ml-4 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-background [&_pre]:p-2 [&_ul]:list-disc">
                {/* ReactMarkdown trasforma il testo Markdown in elementi HTML. */}
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {/* !!valore = converte in vero/falso. ?.length = "lunghezza di citations, se c'e'".
                  Cosi' le fonti compaiono solo se ce ne sono. */}
              {!!m.citations?.length && (
                // Lista numerata delle fonti; border-t = linea sopra; aria-label = nome leggibile.
                <ol className="space-y-1 border-t pt-2 text-xs" aria-label="Sources">
                  {/* Una voce per ogni fonte: c.n = numero, c.title = titolo, c.url = link. */}
                  {m.citations.map((c) => (
                    <li key={c.n}>
                      {/* target="_blank" apre il link in una nuova scheda; rel="noreferrer" non
                          passa al sito esterno l'indirizzo della pagina di provenienza. */}
                      <a href={c.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        [{c.n}] {c.title}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ),
        )}
        {/* Indicatore di attesa: visibile solo mentre pending e' true (&& come sopra). */}
        {pending && (
          // Riga con icona + testo. text-muted-foreground = grigio attenuato del tema.
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {/* animate-spin = rotazione continua; size-4 = dimensione 1rem. */}
            {/* aria-hidden = icona solo decorativa: gli screen reader la ignorano. */}
            <Loader2Icon className="size-4 animate-spin" aria-hidden /> Thinking… local models can take a minute.
          </p>
        )}
        {/* Errore: se error non e' vuoto, mostra il messaggio in rosso (text-destructive). */}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      {/* Form: contenitore del campo e del bottone. <form> e' il tag HTML per un modulo di invio.
          flex items-end = elementi in riga, allineati in basso. */}
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          // onSubmit = scatta quando il form viene inviato (Invio sul bottone o sul campo).
          // preventDefault() blocca il comportamento predefinito del browser (ricaricare la
          // pagina): da qui in poi comanda React.
          e.preventDefault();
          send(input);
        }}
      >
        {/* Campo di testo multi-riga. Attributi, in breve:
            value/onChange = campo "controllato": il testo vive in input e onChange lo aggiorna;
            onKeyDown = gestisce i tasti; placeholder = testo grigio di esempio;
            aria-label = nome per gli screen reader (manca un <label> visibile);
            className = stile Tailwind (max-h-40 = altezza massima, resize-none = niente
            trascinamento); maxLength = massimo 4000 caratteri. */}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // Invio manda il messaggio; Shift+Invio va a capo. !e.nativeEvent.isComposing ignora
            // l'Invio usato per confermare la composizione di caratteri (es. input giapponese).
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              // Blocca l'a-capo predefinito del campo, poi invia.
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={placeholder}
          aria-label="Your question"
          className="max-h-40 min-h-11 resize-none"
          maxLength={4000}
        />
        {/* Bottone invio. size="icon" = quadrato con sola icona; disabled = spento se stiamo
            aspettando la risposta o il campo e' vuoto (!input.trim()). */}
        <Button type="submit" size="icon" disabled={pending || !input.trim()} aria-label="Send">
          {/* aria-hidden: l'icona e' decorativa; il nome per gli screen reader e' aria-label. */}
          <SendIcon aria-hidden />
        </Button>
      </form>
    </div>
  );
}
