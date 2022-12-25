import * as d3 from "d3";

/**
 * Funkcija za rešavanje problema putnog trgovca pomoću grubog algoritma
 * @param n: broj čvorova u grafu
 * @param E: lista grana u grafu, predstavljena kao trojke (u, v, w) gde je u i v čvorovi, a w težina grana (u, v)
 * @param delay: vreme pauze između koraka algoritma
 * @returns Niz čvorova predstavljajući minimalni put koji obilazi sve čvorove jednom
 */
export async function solveTSPGreedy(
  n: number,
  E: Array<[number, number, number]>,
  delay: number
): Promise<Array<number>> {
  console.log(
    "Počinjemo rešavanje problema putnog trgovca grubim algoritmom..."
  );
  const result: Array<number> = [0];
  const visited = new Set([0]);

  // kreiraj svg element
  const width = 640;
  const height = 640;
  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // kreiraj čvorove i grane
  const nodes = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
    });
  }
  const links = [];
  for (const [u, v, w] of E) {
    links.push({
      source: nodes[u],
      target: nodes[v],
      weight: w,
    });
  }

  // nacrtaj grane
  const link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", (d) => d.weight)
    .style("stroke", "gray");

  // nacrtaj čvorove
  const node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", "steelblue");

  // dodaj labelu za svaki čvor
  const label = svg
    .selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .text((d) => d.id)
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style("fill", "black");

  // promeni poziciju svakog čvora i grane
  const tick = () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  };

  // pokreni simulaciju
  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink(links).distance(350))
    .on("tick", tick);

  while (result.length < n) {
    console.log(`Trenutni rezultat: ${result}`);
    let minWeight = Number.MAX_VALUE;
    let next: number | undefined;
    for (const [u, v, w] of E) {
      if (visited.has(u) && !visited.has(v) && w < minWeight) {
        minWeight = w;
        next = v;
      }
    }
    console.log(
      `Najmanji brid koji vodi ka neposetjenom čvoru je brid (${
        result[result.length - 1]
      }, ${next}) sa težinom ${minWeight}`
    );
    if (next === undefined) {
      throw new Error("Graf nije povezan");
    }
    result.push(next);
    visited.add(next);
    console.log(
      `Dodajemo čvor ${next} u rezultat i označavamo ga kao posetjen`
    );
    //await new Promise((resolve) => setTimeout(resolve, delay));
  }

  result.push(0); // dodajemo početni čvor na kraj

  // obojimo grane koje čine rešenje problema putnog trgovca u crveno
  let current = result[0];
  for (const next of result.slice(1)) {
    const link = svg
      .selectAll(".link")
      .filter(
        (d: any) =>
          (d.source.id === current && d.target.id === next) ||
          (d.source.id === next && d.target.id === current)
      )
      .style("stroke", "red");

    console.log(`Bojimo granu (${current}, ${next}) u crveno`);
    current = next; // postavljamo trenutni čvor

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.log(`Rešenje problema putnog trgovca je: ${result}`);
  
  return result;
}
