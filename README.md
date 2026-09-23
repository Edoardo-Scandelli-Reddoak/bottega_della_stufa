# La Bottega della Stufa — sito monopagina

Sito statico (HTML/CSS/JS, nessuna dipendenza) realizzato con i dati della riga 8 del
questionario e il materiale grafico del Drive.

## Avvio in locale

```bash
python3 -m http.server 8088
# → http://localhost:8088
```

## Struttura

```
index.html                 pagina unica (+ dati strutturati schema.org)
assets/css/style.css       stile, design system e responsive
assets/js/main.js          menu mobile, reveal allo scroll, scrollspy, lightbox
assets/img/                logo, foto e versioni .webp
assets/docs/               presentazione aziendale in PDF
```

## Dati usati

- **Ragione sociale**: La bottega della stufa di Tartari Lorenzo — P.IVA 04203561206
- **Sede legale**: Via Landa 197/1, 40050 Monte San Pietro (BO)
- **Negozio**: Via Lavino 90A, Calderino — Monte San Pietro (BO)
- **Telefono / WhatsApp**: 335 825 0278 (Lorenzo) · 349 596 2457 (Bryan)
- **Email**: labottegadellastufa@gmail.com
- **Orari**: Lun 15.30–18.30 · Mar–Ven 8.30–12.30 e 15.30–18.30 · Sab 8.30–12.30 · Dom chiuso

## Modulo contatti

Il modulo funziona subito senza backend: alla conferma apre il client di posta
con il messaggio già compilato verso `labottegadellastufa@gmail.com`.

Per farlo inviare in background (senza aprire l'email), basta incollare un
endpoint in `assets/js/main.js`:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxx';
```

Va bene qualunque servizio che accetti una POST `multipart/form-data`
(Formspree, Web3Forms, una funzione serverless su Vercel).

## Da completare

- Endpoint del modulo contatti, se si vuole l'invio senza client di posta.
