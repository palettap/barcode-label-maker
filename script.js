async function condividiEtichetta() {
  const canvas = document.getElementById("barcode");
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 100] });

  // Carica logo da file logo.png
  const logoUrl = "logo.png";
  const logoImg = new Image();
  logoImg.src = logoUrl;

  await new Promise((resolve, reject) => {
    logoImg.onload = () => resolve();
    logoImg.onerror = () => reject(new Error("Logo non caricato"));
  });

  // Disegna layout PDF
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 100, "F");
  doc.addImage(logoImg, "PNG", 10, 5, 80, 12);

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

  if (navigator.share) {
    const file = new File([pdfBlob], `${ultimoCodiceGenerato}_etichetta.pdf`, { type: "application/pdf" });
    try {
      await navigator.share({
        files: [file],
        title: "Etichetta",
        text: "Ecco l'etichetta generata."
      });
    } catch (err) {
      alert("Condivisione annullata o fallita.");
    }
  } else {
    alert("La funzione di condivisione non è supportata da questo browser.");
  }
}
