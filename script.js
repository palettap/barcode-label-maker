
console.log('Web app Naputeca.Pro caricata.');

async function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Logo in alto
  const logoUrl = "https://raw.githubusercontent.com/palettap/barcode-label-maker/main/logo.png"; // Modifica se necessario
  try {
    const logoRes = await fetch(logoUrl);
    const logoBlob = await logoRes.blob();
    const logoData = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });
    doc.addImage(logoData, "PNG", 10, 5, 80, 12);
  } catch (e) {
    console.warn("Logo non caricato", e);
  }

  // Info etichetta
  doc.setTextColor(13, 81, 100);
  doc.setFontSize(10);
  doc.text("Codice: " + (window.ultimoCodiceGenerato || ""), 50, 50, null, null, 'center');
  doc.text("Descrizione: " + (window.ultimaDescrizione || ""), 50, 55, null, null, 'center');
  if (window.ultimaQuantita) doc.text("Quantità: " + window.ultimaQuantita, 50, 60, null, null, 'center');
  if (window.ultimoPeso) doc.text("Peso: " + window.ultimoPeso, 50, 60, null, null, 'center');
  doc.line(10, 63, 90, 63);
  doc.addImage(imgData, "PNG", 10, 66, 80, 20);

  // Generazione PDF
  const pdfBlob = doc.output("blob");
  const pdfFile = new File([pdfBlob], (window.ultimoCodiceGenerato || "etichetta") + ".pdf", { type: "application/pdf" });

  // Condivisione
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: "Etichetta Prodotto",
        text: "Etichetta generata da Naputeca.Pro"
      });
    } catch (err) {
      alert("Condivisione annullata o fallita.");
      console.error(err);
    }
  } else {
    // Fallback automatico: scarica PDF
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = pdfFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Condivisione non supportata. Il file è stato scaricato.");
  }
}
