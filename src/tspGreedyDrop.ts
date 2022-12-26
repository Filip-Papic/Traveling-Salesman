import * as d3 from "d3";

/**
 * Greedy drop algoritam za rešavanje TSP problema
 * @param n Broj čvorova u grafu
 * @param edges Grane grafa i njihove težine
 * @param delay Vreme pauze između koraka algoritma
 * @returns Rešenje TSP problema
 */
export async function solveTSPGreedyDrop(
  n: number,
  edges: [number, number, number][],
  delay: number
): Promise<[number, number, number][]> {
  const permutation = initializePermutation(n);
  // Niz za skladištenje rešenja TSP-a
  const solution: [number, number, number][] = [];

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
  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink(links).distance(350))
    .on("tick", tick);

  let edge: [number, number, number];

  // Iterirajte kroz permutaciju cvorova
  for (let i = 0; i < permutation.length - 1; i++) {
    console.log(`Iteration ${i + 1}`);
    console.log(`Current permutation: ${permutation}`);

    // Pronađite granu između trenutnog i sledećeg cvora u permutaciji
    edge = findEdge(edges, permutation[i], permutation[i + 1]);

    console.log(`Selected edge: ${edge[0]}, ${edge[1]}`);

    // Uklonite granu iz niza sa granama
    edges = edges.filter((e) => !(e[0] === edge[0] && e[1] === edge[1]));

    console.log(`Updated edges list: ${edges}`);

    link.style("stroke", (d) => {
      if (d.source.id === edge[0] && d.target.id === edge[1]) {
        return "red";
      }
      return "gray";
    });

    // Dodajte granu u rešenje TSP-a
    solution.push(edge);
    console.log(`Current solution: ${solution}`);

    // Dodajte granu u niz sa posecenim granama
    visited.push(edge);
    tick();

    // Pauzirajte izvršavanje programa
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Dodajte granu između poslednjeg i prvog cvora u permutaciji
  edge = findEdge(edges, permutation[permutation.length - 1], permutation[0]);
  solution.push(edge);
  visited.push(edge);
  tick();

  console.log(`Solution: ${solution}`);
  console.log(`Total distance: ${solution.reduce((a, b) => a + b[2], 0)}`);

  return solution;
}

// Funkcija za inicijalizaciju niza sa proizvoljnim permutacijama cvorova
function initializePermutation(n: number): number[] {
  // Niz sa svim cvorovima
  const nodes: number[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push(i);
  }

  // Postavite cvorove u proizvoljnom redosledu
  shuffle(nodes);

  return nodes;
}

// Funkcija za pronalaženje grane između dva cvora
function findEdge(
  edges: [number, number, number][],
  node1: number,
  node2: number
): [number, number, number] {
  for (const edge of edges) {
    if (
      (edge[0] === node1 && edge[1] === node2) ||
      (edge[0] === node2 && edge[1] === node1)
    ) {
      return edge;
    }
  }
  return [-1, -1, -1];
}

// Funkcija za mešanje elemenata niza u proizvoljnom redosledu (Fisher-Yates shuffle)
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
