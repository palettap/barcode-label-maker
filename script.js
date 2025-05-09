let ultimoCodiceGenerato = "";
let ultimaDescrizione = "";
let ultimaQuantita = "";
let ultimoPeso = "";

function calcolaEAN13CheckDigit(code) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return ((10 - (sum % 10)) % 10).toString();
}

function generaEtichetta() {
  const codice = document.getElementById("codice").value.padStart(6, '0');
  const descrizione = document.getElementById("descrizione").value;
  const quantita = document.getElementById("quantita").value.padStart(3, '0');
  const pesoInt = document.getElementById("peso_int").value.padStart(2, '0');
  const pesoDec = document.getElementById("peso_dec").value.padStart(3, '0');

  const base = codice + "000" + quantita;
  const full = base + calcolaEAN13CheckDigit(base);

  JsBarcode("#barcode", full, { format: "ean13", displayValue: true });
  document.getElementById("output_codice").innerText = "Codice EAN-13: " + full;

  ultimoCodiceGenerato = codice;
  ultimaDescrizione = descrizione;
  ultimaQuantita = quantita;
  ultimoPeso = pesoInt + "." + pesoDec;
}

async function creaPDF() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Sfondo e logo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 100, "F");

  // Logo opzionale (base64 o URL hostato)
  // doc.addImage(logoBase64, "PNG", 10, 5, 80, 12);

  // Testo
  doc.setTextColor(13, 81, 100);
  doc.setFontSize(10);
  doc.text("Codice: " + ultimoCodiceGenerato, 50, 30, null, null, 'center');
  doc.text("Descrizione: " + ultimaDescrizione, 50, 36, null, null, 'center');
  if (ultimaQuantita) doc.text("Quantità: " + ultimaQuantita, 50, 42, null, null, 'center');
  if (ultimoPeso) doc.text("Peso: " + ultimoPeso + " kg", 50, 48, null, null, 'center');

  doc.setDrawColor(13, 81, 100);
  doc.line(10, 52, 90, 52);

  doc.addImage(imgData, "PNG", 10, 56, 80, 20);
  return doc;
}

async function stampaEtichetta() {
  const doc = await creaPDF();
  doc.save(ultimoCodiceGenerato + "_etichetta.pdf");
}

async function condividiEtichetta() {
  const doc = await creaPDF();
  const pdfBlob = doc.output("blob");
  const file = new File([pdfBlob], ultimoCodiceGenerato + "_etichetta.pdf", { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "Etichetta " + ultimoCodiceGenerato,
        files: [file]
      });
    } catch (error) {
      alert("Errore condivisione: " + error);
    }
  } else {
    alert("Condivisione non supportata su questo dispositivo.");
  }
}