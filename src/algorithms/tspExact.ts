import * as d3 from "d3";

// klasa PriorityQueue implementira prioritetnu listu
class PriorityQueue<T> {
  private items: T[];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.items = [];
    this.compare = compare;
  }

  enqueue(item: T) {
    this.items.push(item);
    this.items.sort(this.compare);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  size(): number {
    return this.items.length;
  }
}

/**
 * Rešava TSP problem eksaktnim algoritmom
 * @param n broj čvorova u grafu
 * @param edges grane grafa i njihove težine
 * @param delay vreme pauze između koraka algoritma
 * @returns rešenje TSP problema
 */
export async function solveTSPExact(
  n: number,
  edges: [number, number, number][],
  delay: number
): Promise<[number, number, number][]> {
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

  // grane su u obliku [u, v, w] gde su u i v čvorovi a w težina grane
  const links = [];
  for (const [u, v, w] of edges) {
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

  const visited: [number, number, number][] = [];
  let bestLength = Infinity;
  let bestPath: [number, number, number][] = [];
  let pathLength = 0;
  let currentCity = 0;

  const pq = new PriorityQueue<[number, number, number]>((a, b) => a[2] - b[2]);

  // Pomocna funkcija koja vraca najmanju granu izmedju trenutnog grada i narednog grada
  const findNextClosestCity = (currentCity: number) => {
    let minWeight = Infinity;
    let minEdge: [number, number, number] = [-1, -1, -1];
    for (const [u, v, w] of edges) {
      if (
        u === currentCity &&
        !visited.find(([x, y, z]) => x === u && y === v && z === w)
      ) {
        if (w < minWeight) {
          minWeight = w;
          minEdge = [u, v, w];
        }
      }
    }
    return minEdge;
  };

  // Dodaj sve grane koje vode iz trenutnog grada u prioritetnu listu
  for (const [u, v, w] of edges) {
    if (u === currentCity) {
      pq.enqueue([u, v, w]);
    }
  }

  // promeni poziciju svakog čvora i grane
  const tick = () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .style("stroke", (d) => {
        for (const [u, v, w] of visited) {
          if (d.source.id === u && d.target.id === v && d.weight === w) {
            return "red";
          }
        }
        return "gray";
      });

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  };

  // pokreni simulaciju
  d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink(links).distance(350))
    .on("tick", tick);

  // Branche and Bound

  // Dok god ima grana u prioritetnoj listi, uzmi najmanju granu i nastavi put
  while (pq.size() > 0) {
    // Ukloni granu sa najmanjom tezinom iz prioritetne liste
    const [u, v, w] = pq.dequeue()!;
    currentCity = v;
    pathLength += w;
    visited.push([u, v, w]);

    console.log(`Posetio grad ${v} iz grada ${u} tezine ${w}`)
    tick();

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    
    // Izracunaj donju granicu
    let lowerBound = pathLength;
    for (let i = 0; i < n; i++) {
      if (!visited.find(([u]) => u === i)) {
        lowerBound += findNextClosestCity(i)[2];
      }
    }

    // Ako je duzina puta do sada manja od najbolje duzine puta i ako je posetio sve gradove, azuriraj najbolju duzinu puta
    if (pathLength < bestLength && visited.length === n) {
      console.log(`Najbolji put: ${visited.map(([x, y]) => `${x} -> ${y}`).join(" -> ")}`);
      bestLength = pathLength;
      bestPath = [...visited];
    }

    // Ako je donja granica veca ili jednaka najboljoj duzini puta, preskoci ovaj put
    if (lowerBound >= bestLength) {
      continue;
    }

    // Dodaj sve grane koje vode iz trenutnog grada u prioritetnu listu
    for (const [u, v, w] of edges) {
      if (u === currentCity && !visited.find(([x, y]) => x === u && y === v)) {
        pq.enqueue([u, v, w]);
      }
    }
  }

  console.log(
    `Gotovo. Najbolji put: ${bestPath
      .map(([x, y]) => `${x} -> ${y}`)
      .join(" -> ")}`
  );
  console.log(`Duzina najboljeg puta: ${bestLength}`);

  return bestPath;
}
