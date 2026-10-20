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

Il modulo invia in background tramite **Web3Forms** (`assets/js/main.js`,
costanti `FORM_ENDPOINT` e `WEB3FORMS_KEY`). Le richieste arrivano all'email
con cui è stata generata la access key. Antispam: campo nascosto `botcheck`.

Svuotando `FORM_ENDPOINT` il modulo torna ad aprire il client di posta verso
`labottegadellastufa@gmail.com`.
