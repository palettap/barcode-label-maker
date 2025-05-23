// Configurazione unica layout etichetta
const ETICHETTA = {
  page:    { width: 100, height: 100, orientation: "portrait", unit: "mm" },
  logo:    { url: "logo.png", x: 10, y: 35, w: 80, h: 24 },
  barcode: { x: 10, y: 5,  w: 80, h: 23 },
  line:    { x1: 10, y1: 37, x2: 90, y2: 37 },
  text: {
    color: [13, 81, 100],
    size: 12,
    codice:      { x: 50, y: 34, align: "center" },
    descrizione: { x: 10, y: 62, maxWidth: 80, lineHeightFactor: 1.2 },
    bottomLeft:  { x: 15, y: 80, align: "left"  },
    bottomRight: { x: 84, y: 80, align: "right" }
  }
};

/** salva il data-URI del PDF in un array dentro localStorage */
function salvaInArchivio(dataUri, nome) {
  const key = 'etichettaArchive';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push({ uri: dataUri, nome, timestamp: Date.now() });
  localStorage.setItem(key, JSON.stringify(arr));
}
function clearArchivio() {
  localStorage.removeItem('etichettaArchive');
}
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
  try {
    await new Promise((res, rej) => {
      logoImg.onload  = res;
      logoImg.onerror = rej;
    });
    const L = ETICHETTA.logo;
    doc.addImage(logoImg, "PNG", L.x, L.y, L.w, L.h);
  } catch {
    console.warn("Logo non caricato, continuo senza.");
  }

  // Barcode
  const B = ETICHETTA.barcode;
  doc.addImage(imgData, "PNG", B.x, B.y, B.w, B.h);

  // Linea di separazione
  const L0 = ETICHETTA.line;
  doc.setDrawColor(...ETICHETTA.text.color);
  doc.line(L0.x1, L0.y1, L0.x2, L0.y2);

  // Codice EAN-13 (solo numeri) sotto il barcode
  const C = ETICHETTA.text.codice;
  doc.setFontSize(ETICHETTA.text.size);
  doc.setTextColor(...ETICHETTA.text.color);
  doc.text(ultimoCodiceGenerato, C.x, C.y, null, null, C.align);

  // Descrizione multilinea accanto al logo
  const D = ETICHETTA.text.descrizione;
  const lines = doc.splitTextToSize(ultimaDescrizione, D.maxWidth);
  doc.text(lines, D.x, D.y, { lineHeightFactor: D.lineHeightFactor });

  // Testi in basso: Codice interno e Peso/Quantità
  const BL = ETICHETTA.text.bottomLeft;
  const BR = ETICHETTA.text.bottomRight;
  doc.text(`Codice: ${ultimoCodiceGenerato}`, BL.x, BL.y, null, null, BL.align);
  if (ultimoPeso) {
    doc.text(`Peso: ${ultimoPeso}`, BR.x, BR.y, null, null, BR.align);
  } else {
    doc.text(`Quantità: ${ultimaQuantita}`, BR.x, BR.y, null, null, BR.align);
  }

  return doc;
}

// Funzione di stampa dell'etichetta
async function stampaEtichetta() {
  const canvas  = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const doc     = await creaPdfEtichetta(imgData);
  // 1) genera data-URI e salva in archivio
  const dataUri = doc.output('datauristring');
  const meta = ultimoPeso
    ? `${ultimoCodiceGenerato}_${ultimoPeso.replace(' ','')}`
    : `${ultimoCodiceGenerato}_${ultimaQuantita.replace(' ','')}`;
  salvaInArchivio(dataUri);
  // 2) poi scarica il PDF
  doc.save(`${ultimoCodiceGenerato}_etichetta.pdf`);

}

// Funzione di condivisione dell'etichetta
async function condividiEtichetta() {
  const canvas  = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const doc     = await creaPdfEtichetta(imgData);
  const pdfBlob = doc.output("blob");

  // salva anche quando si condivide
  const dataUri = doc.output('datauristring');
  const meta = ultimoPeso
    ? `${ultimoCodiceGenerato}_${ultimoPeso.replace(' ','')}`
    : `${ultimoCodiceGenerato}_${ultimaQuantita.replace(' ','')}`;
  salvaInArchivio(dataUri);
  if (navigator.share) {
    const file = new File([pdfBlob], `${ultimoCodiceGenerato}_etichetta.pdf`, { type: "application/pdf" });
    try {
      await navigator.share({ files: [file], title: "Etichetta", text: "Ecco l'etichetta generata." });
    } catch {
      alert("Condivisione annullata o fallita.");
    }
  } else {
    // Fallback al download
    doc.save(`${ultimoCodiceGenerato}_etichetta.pdf`);
  }
}
/** Salva l’etichetta solo in archivio (senza scaricare) */
async function salvaEtichetta() {
  const canvas  = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const doc     = await creaPdfEtichetta(imgData);
  const dataUri = doc.output('datauristring');
  const meta = ultimoPeso
    ? `${ultimoCodiceGenerato}_${ultimoPeso.replace(' ','')}`
    : `${ultimoCodiceGenerato}_${ultimaQuantita.replace(' ','')}`;
  salvaInArchivio(dataUri, meta);
  alert("Etichetta salvata in archivio.");
}
