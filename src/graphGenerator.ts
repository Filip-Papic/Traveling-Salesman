/**
 * Preuzima kompletan graf sa n čvorova i skida ga u CSV datoteku.
 * @param edges Niz grana grafa
 */
export function downloadCompleteGraph(edges: [number, number, number][]) {

  // Dodaj zaglavlje u niz grana grafa
  edges.unshift(["Node1" as any, "Node2" as any, "Weight" as any]);

  // Upišite grane u CSV datoteku
  const csv = edges.map((e: any) => e.join(",")).join("\n");

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
 * Generiše kompletan graf sa n čvorova i vraća grane grafa i njihove težine.
 *
 * @param n Broj čvorova u grafu.
 * @return Grane grafa i njihove težine
 */
export function generateCompleteGraph(n: number): [number, number, number][] {
  // Niz za skladištenje grana grafa i njihovih težina
  const edges: [number, number, number][] = [];

  // Generišite grane grafa
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Generišite nasumičnu težinu za granu
      const weight: number = Math.floor(Math.random() * 10) + 1;
      edges.push([i, j, weight]);
    }
  }

  return edges;
}

/**
 * Na canvas elementu iscrtava kompletan graf sa n čvorova.
 *
 * @param n Broj čvorova u grafu.
 */
export function drawCompleteGraph(n: number, canvas: HTMLCanvasElement) {
  //canvas for now, later change to D3 or something
  // Kreiraj 2D kontekst canvas elementa
  const ctx = canvas.getContext("2d")!;

  // Očisti canvas element
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Postavi širinu linije i stroke style
  ctx.lineWidth = 1;
  ctx.strokeStyle = "gray";

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
