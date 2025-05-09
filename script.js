console.log('Web app Naputeca.Pro caricata.');

async function stampaEtichetta() {
  const canvas = document.getElementById("barcode");
  if (!canvas) return alert("Nessun codice a barre generato.");
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Logo incorporato come immagine base64 (esempio, sostituisci con il tuo vero logo se vuoi)
  const logo = new Image();
  logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
  await new Promise(resolve => logo.onload = resolve);
  doc.addImage(logo, "PNG", 30, 5, 40, 20); // centrato

  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(10, 28, 90, 28); // riga separatrice

  doc.setFontSize(12);
  doc.setTextColor(13, 81, 100);
  doc.text(`Codice: ${window.ultimoCodiceGenerato || "-"}`, 10, 35);
  doc.text(`Descrizione: ${window.ultimaDescrizione || "-"}`, 10, 43);

  if (window.ultimoPeso) doc.text(`Peso: ${window.ultimoPeso}`, 10, 51);
  if (window.ultimaQuantita) doc.text(`Quantità: ${window.ultimaQuantita}`, 10, 51);

  doc.line(10, 55, 90, 55);
  doc.addImage(imgData, "PNG", 20, 58, 60, 25); // barcode centrato

  const nomeFile = `${window.ultimoCodiceGenerato || "etichetta"}_etichetta.pdf`;
  doc.save(nomeFile);
}

function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  if (!canvas) return alert("Nessun codice a barre da condividere.");
  canvas.toBlob(blob => {
    const file = new File([blob], "etichetta.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        title: "Etichetta",
        text: "Etichetta generata da Naputeca.Pro",
        files: [file]
      }).catch(err => console.error("Errore nella condivisione:", err));
    } else {
      alert("Condivisione non supportata su questo dispositivo.");
    }
  });
}
