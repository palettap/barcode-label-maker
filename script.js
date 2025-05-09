let articoli = [];
let tipoArticolo = "standard";
let ultimoCodiceGenerato = "", ultimaDescrizione = "", ultimaQuantita = "", ultimoPeso = "";

async function generaPDF() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Sfondo e logo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 100, "F");
  const logo = await fetch("logo.png").then(r => r.blob()).then(b => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(b);
  }));
  doc.addImage(logo, "PNG", 10, 5, 80, 12);

  // Testo
  doc.setTextColor(13, 81, 100);
  doc.setFontSize(10);
  doc.text("Codice: " + ultimoCodiceGenerato, 50, 50, null, null, 'center');
  doc.text("Descrizione: " + ultimaDescrizione, 50, 55, null, null, 'center');
  if (ultimaQuantita) doc.text("Quantità: " + ultimaQuantita, 50, 60, null, null, 'center');
  if (ultimoPeso) doc.text("Peso: " + ultimoPeso + " kg", 50, 60, null, null, 'center');
  doc.setDrawColor(13, 81, 100);
  doc.line(10, 63, 90, 63);
  doc.addImage(imgData, "PNG", 10, 66, 80, 20);
  return doc;
}

async function stampaEtichetta() {
  const doc = await generaPDF();
  doc.save(ultimoCodiceGenerato + "_etichetta.pdf");
}

async function condividiEtichetta() {
  const doc = await generaPDF();
  const pdfBlob = doc.output("blob");

  if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], ultimoCodiceGenerato + "_etichetta.pdf", { type: "application/pdf" })] })) {
    const file = new File([pdfBlob], ultimoCodiceGenerato + "_etichetta.pdf", { type: "application/pdf" });
    await navigator.share({ files: [file], title: "Etichetta", text: "Etichetta generata" });
  } else {
    alert("Condivisione non supportata da questo dispositivo.");
  }
}