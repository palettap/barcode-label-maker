async function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  const logoUrl = "data:image/png;base64,..."; // inserisci lo stesso base64 del logo usato in stampa
  const logo = await fetch(logoUrl).then(r => r.blob()).then(b => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(b);
  }));

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 100, "F");
  doc.addImage(logo, "PNG", 10, 5, 80, 12);

  doc.setTextColor(13, 81, 100);
  doc.setFontSize(10);
  doc.text("Codice: " + ultimoCodiceGenerato, 50, 50, null, null, 'center');
  doc.text("Descrizione: " + ultimaDescrizione, 50, 55, null, null, 'center');
  if (ultimaQuantita) doc.text("Quantità: " + ultimaQuantita, 50, 60, null, null, 'center');
  if (ultimoPeso) doc.text("Peso: " + ultimoPeso, 50, 60, null, null, 'center');
  doc.setDrawColor(13, 81, 100);
  doc.line(10, 63, 90, 63);
  doc.addImage(imgData, "PNG", 10, 66, 80, 20);

  const pdfBlob = doc.output("blob");
  const file = new File([pdfBlob], `${ultimoCodiceGenerato}_etichetta.pdf`, { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      title: "Etichetta prodotto",
      text: "Ecco l’etichetta generata:",
      files: [file],
    }).catch(err => console.error("Errore condivisione:", err));
  } else {
    alert("Condivisione non supportata su questo dispositivo.");
  }
}