async function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Logo base64 (puoi sostituire con fetch se preferisci)
  const logoUrl = "data:image/png;base64,..."; // usa la stringa già nel tuo HTML

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 100, "F");
  doc.addImage(logoUrl, "PNG", 10, 5, 80, 12);

  doc.setTextColor(13, 81, 100);
  doc.setFontSize(10);
  doc.text("Codice: " + ultimoCodiceGenerato, 50, 50, null, null, 'center');
  doc.text("Descrizione: " + ultimaDescrizione, 50, 55, null, null, 'center');
  if (ultimaQuantita) doc.text("Quantità: " + ultimaQuantita, 50, 60, null, null, 'center');
  if (ultimoPeso) doc.text("Peso: " + ultimoPeso, 50, 60, null, null, 'center');
  doc.setDrawColor(13, 81, 100);
  doc.line(10, 63, 90, 63);
  doc.addImage(imgData, "PNG", 10, 66, 80, 20);

  const pdfBlob = await new Promise(resolve => doc.output("blob", resolve));
  const pdfFile = new File([pdfBlob], "etichetta.pdf", { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    await navigator.share({
      files: [pdfFile],
      title: "Etichetta Prodotto",
      text: "Etichetta generata da Naputeca.Pro"
    });
  } else {
    alert("La condivisione diretta del PDF non è supportata su questo dispositivo.");
  }
}