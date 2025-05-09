
async function creaPDF() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 100, "F");

  const logoUrl = "data:image/png;base64,..."; // Inserire logo valido
  const logo = await fetch(logoUrl).then(r => r.blob()).then(b => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(b);
  }));
  doc.addImage(logo, "PNG", 10, 5, 80, 12);

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

console.log('Web app Naputeca.Pro caricata.');

async async function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  const logoUrl = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."; // Inserisci qui il logo base64 usato nella stampa

  try {
    const logoBlob = await fetch(logoUrl).then(r => r.blob());
    const logoData = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 100, 100, "F");
    doc.addImage(logoData, "PNG", 10, 5, 80, 12);
    doc.setTextColor(13, 81, 100);
    doc.setFontSize(10);
    doc.text("Codice: " + (window.ultimoCodiceGenerato || ""), 50, 50, null, null, 'center');
    doc.text("Descrizione: " + (window.ultimaDescrizione || ""), 50, 55, null, null, 'center');
    if (window.ultimaQuantita) doc.text("Quantità: " + window.ultimaQuantita, 50, 60, null, null, 'center');
    if (window.ultimoPeso) doc.text("Peso: " + window.ultimoPeso, 50, 60, null, null, 'center');
    doc.setDrawColor(13, 81, 100);
    doc.line(10, 63, 90, 63);
    doc.addImage(imgData, "PNG", 10, 66, 80, 20);

    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], (window.ultimoCodiceGenerato || "etichetta") + ".pdf", { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await const doc = await creaPDF();
  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], ultimoCodiceGenerato + '_etichetta.pdf', { type: 'application/pdf' });
  navigator.share({
        files: [pdfFile],
        title: "Etichetta Prodotto",
        text: "Etichetta generata da Naputeca.Pro"
      });
    } else {
      alert("La condivisione diretta del PDF non è supportata su questo dispositivo.");
    }
  } catch (error) {
    console.error("Errore durante la condivisione:", error);
    alert("Si è verificato un errore durante la condivisione.");
  }
}

