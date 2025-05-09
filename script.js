async function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Logo come cerchio nero (puoi sostituirlo con un'immagine base64 se preferisci)
  doc.setFillColor(0, 0, 0);
  doc.circle(15, 75, 7, 'F');

  // Codice a barre
  doc.addImage(imgData, "PNG", 10, 10, 80, 25);

  // Codice numerico sotto al barcode
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text((window.codiceEAN13 || ""), 50, 38, { align: "center" });

  // Descrizione prodotto (2 righe)
  doc.setFontSize(16);
  const descrizione = (window.ultimaDescrizione || "").split(" ");
  const linea1 = descrizione.slice(0, 2).join(" ");
  const linea2 = descrizione.slice(2).join(" ");
  doc.text(linea1, 50, 50, { align: "center" });
  if (linea2) doc.text(linea2, 50, 58, { align: "center" });

  // Codice articolo e Peso/Quantità
  doc.setFontSize(12);
  doc.text("Codice: " + (window.ultimoCodiceGenerato || ""), 10, 90);
  if (window.ultimoPeso) {
    doc.text("Peso: " + window.ultimoPeso, 60, 90);
  } else if (window.ultimaQuantita) {
    doc.text("Quantità: " + window.ultimaQuantita, 60, 90);
  }

  // Salvataggio in PDF e condivisione
  const pdfBlob = doc.output("blob");
  const pdfFile = new File([pdfBlob], (window.ultimoCodiceGenerato || "etichetta") + ".pdf", { type: "application/pdf" });

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