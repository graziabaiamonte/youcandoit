/**
 * use-mobile.ts - Un "custom hook" (hook personalizzato) che risponde a una domanda:
 * "lo schermo è di un telefono?" Restituisce true (mobile) o false (desktop).
 *
 * Cos'è un hook: una funzione il cui nome inizia con "use" e che può usare gli hook di
 * React (useState, useEffect, ...). Serve a riusare logica con stato tra più componenti.
 * Doc: https://react.dev/learn/reusing-logic-with-custom-hooks
 *
 * Ruolo nel progetto: viene importato solo da components/ui/sidebar.tsx (la sidebar shadcn).
 * La sidebar usa il risultato per mostrare su mobile un menu a scomparsa e su desktop
 * una barra fissa laterale.
 *
 * Next.js 16: questo file NON ha la direttiva "use client" in cima. Non è un entry point:
 * il "use client" sta in sidebar.tsx, quindi anche questo codice gira nel browser.
 * Vedi la guida "use client" in node_modules/next/dist/docs/01-app/03-api-reference/
 * 01-directives/use-client.md.
 *
 * React 19.3: usa useSyncExternalStore, l'API ufficiale per leggere una sorgente esterna
 * (qui la media query del browser) e restare aggiornati senza copiarla in useState.
 * Doc: https://react.dev/reference/react/useSyncExternalStore
 */
import * as React from "react"

// Soglia in pixel: sotto i 768px lo schermo è considerato "mobile" (valore usato da shadcn/ui).
const MOBILE_BREAKPOINT = 768
// Media query CSS: stringa che il browser valuta; diventa vera se la larghezza è <= 767px.
// Si scrive "-1" perché max-width è inclusivo: 768px è già desktop.
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// subscribe: React la chiama per iscriversi ai cambiamenti. Riceve onChange, una funzione
// che React fornisce e che va chiamata quando il valore cambia (es. ruoti il telefono).
// Il tipo "() => void" significa: una funzione senza parametri e che non restituisce nulla.
function subscribe(onChange: () => void) {
  // window è l'oggetto globale del browser; matchMedia crea un oggetto che controlla QUERY.
  // Doc MDN: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
  const mql = window.matchMedia(QUERY)
  // Ascolta l'evento "change": ogni volta che la media query cambia esito, chiama onChange.
  mql.addEventListener("change", onChange)
  // Funzione di pulizia restituita a React: quando il componente sparisce, rimuove il listener
  // così non resta attivo per sempre.
  return () => mql.removeEventListener("change", onChange)
}

// export: rende la funzione importabile da altri file. Il nome inizia con "use" per convenzione
// (così React e ESLint riconoscono un hook e ne controllano le regole).
// Il valore restituito è un boolean: true se mobile, false se desktop.
export function useIsMobile() {
  // useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot): legge un valore esterno
  // e fa ri-renderizzare il componente quando cambia. Gli argomenti sono tre funzioni:
  // 1) subscribe: come ascoltare i cambiamenti (vedi sopra).
  // 2) getSnapshot: come leggere il valore attuale nel browser (true se la media query combacia).
  // 3) getServerSnapshot: valore usato sul server (Next.js pre-renderizza le pagine) e nella
  //    prima render lato client (idratazione). Il server non ha "window", quindi non sa la
  //    dimensione dello schermo: si usa false. Così l'HTML iniziale combacia ed evita errori di
  //    "hydration mismatch".
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
