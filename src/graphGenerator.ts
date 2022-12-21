/**
 * Generiše kompletan graf sa n čvorova i vraća grane grafa u CSV formatu.
 *
 * @param n Broj čvorova u grafu.
 * @return Grane grafa u CSV formatu.
 */
export function generateCompleteGraph(n: number): string {
  // Kreiraj prazan niz za čuvanje grana grafa
  const edges: number[][] = [];

  // Dodaj grane između svih parova čvorova
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push([i, j]);
    }
  }

  // Konvertuj niz grana u CSV string
  const csv = edges.map((edge) => edge.join(",")).join("\n");

  // Vrati CSV string
  return csv;
}

/**
 * Generiše kompletnu graf sa n čvorova i sačuva ga u fajl u CSV formatu.
 *
 * @param n Broj čvorova u grafu.
 */
export function downloadCompleteGraph(n: number) {
  // Generiši CSV string od grafa
  const csv = generateCompleteGraph(n);

  // Kreiraj novi link element
  const link = document.createElement("a");

  // Postavi href atribut link elementa na CSV string
  link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

  // Postavi download atribut link elementa
  link.download = "graph" + new Date().getTime() + ".csv";

  // Dodaj link element u telo stranice i klikni ga
  document.body.appendChild(link);
  link.click();

  // Ukloni link element
  document.body.removeChild(link);
}

/**
 * Na canvas elementu iscrtava kompletan graf sa n čvorova.
 *
 * @param n Broj čvorova u grafu.
 */
export function drawCompleteGraph(n: number, canvas: HTMLCanvasElement) { //canvas for now, later change to D3 or something
  // Kreiraj 2D kontekst canvas elementa
  const ctx = canvas.getContext("2d")!;

  // Očisti canvas element
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Postavi širinu linije i stroke style
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";

  // Postavi radius i centar kruga
  const radius = 200;
  const centerX = 250;
  const centerY = 250;

  // Iscrtaj grane grafa
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Izračunaj početne i završne uglove
      const startAngle = (i / n) * 2 * Math.PI;
      const endAngle = (j / n) * 2 * Math.PI;

      // Iscrtaj granu kao linijski segment
      ctx.beginPath();
      ctx.moveTo(
        centerX + radius * Math.cos(startAngle),
        centerY + radius * Math.sin(startAngle)
      );
      ctx.lineTo(
        centerX + radius * Math.cos(endAngle),
        centerY + radius * Math.sin(endAngle)
      );
      ctx.stroke();
    }
  }

  // Iscrtaj čvorove grafa kao krugove
  ctx.fillStyle = "red";
  for (let i = 0; i < n; i++) {
    // Izračunaj ugao čvora
    const angle = (i / n) * 2 * Math.PI;

    // Izračunaj x i y koordinate čvora
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Iscrtaj čvor kao krug
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
