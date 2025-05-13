// Configurazione layout etichetta
const ETICHETTA = {
  page: { width: 100, height: 100, orientation: "portrait", unit: "mm" },
  logo: { url: "logo.png", x: 10, y: 5, w: 80, h: 12 },
  text: {
    color: [13, 81, 100],
    size: 10,
    codice:     { x: 50, y: 50, align: 'center' },
    descrizione:{ x: 50, y: 55, align: 'center' },
    quantita:   { x: 50, y: 60, align: 'center' },
    peso:       { x: 50, y: 65, align: 'center' }
  },
  line:    { x1: 10, y1: 63, x2: 90, y2: 63 },
  barcode: { x: 10, y: 66, w: 80, h: 20 }
};

// Funzione condivisa per creare il PDF dell'etichetta
async function creaPdfEtichetta(imgData) {
  const { jsPDF } = window.jspdf;
  const { width, height, unit, orientation } = ETICHETTA.page;
  const doc = new jsPDF({ orientation, unit, format: [width, height] });

  // Sfondo bianco
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, width, height, "F");

  // Logo
  const logoImg = new Image();
  logoImg.src = ETICHETTA.logo.url;
  await new Promise((res, rej) => {
    logoImg.onload = res;
    logoImg.onerror = rej;
  });
  const L = ETICHETTA.logo;
  doc.addImage(logoImg, "PNG", L.x, L.y, L.w, L.h);

  // Testo
  const T = ETICHETTA.text;
  doc.setTextColor(...T.color);
  doc.setFontSize(T.size);
  doc.text(`Codice: ${ultimoCodiceGenerato}`,       T.codice.x,     T.codice.y,     null, null, T.codice.align);
  doc.text(`Descrizione: ${ultimaDescrizione}`,   T.descrizione.x, T.descrizione.y, null, null, T.descrizione.align);
  if (ultimaQuantita) {
    doc.text(`Quantità: ${ultimaQuantita}`,        T.quantita.x,    T.quantita.y,    null, null, T.quantita.align);
  }
  if (ultimoPeso) {
    doc.text(`Peso: ${ultimoPeso}`,                T.peso.x,        T.peso.y,        null, null, T.peso.align);
  }

  // Linea di separazione
  const L0 = ETICHETTA.line;
  doc.setDrawColor(...T.color);
  doc.line(L0.x1, L0.y1, L0.x2, L0.y2);

  // Barcode
  const B = ETICHETTA.barcode;
  doc.addImage(imgData, "PNG", B.x, B.y, B.w, B.h);

  return doc;
}

// Funzione di stampa dell'etichetta
async function stampaEtichetta() {
  const canvas  = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const doc     = await creaPdfEtichetta(imgData);
  doc.save(`${ultimoCodiceGenerato}_etichetta.pdf`);
}

// Funzione di condivisione dell'etichetta
async function condividiEtichetta() {
  const canvas  = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const doc     = await creaPdfEtichetta(imgData);
  const pdfBlob = doc.output("blob");

  if (navigator.share) {
    const file = new File([pdfBlob], `${ultimoCodiceGenerato}_etichetta.pdf`, { type: "application/pdf" });
    try {
      await navigator.share({
        files: [file],
        title: "Etichetta",
        text:  "Ecco l'etichetta generata."
      });
    } catch {
      alert("Condivisione annullata o fallita.");
    }
  } else {
    // Fallback al download
    doc.save(`${ultimoCodiceGenerato}_etichetta.pdf`);
  }
}
