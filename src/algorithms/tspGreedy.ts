import * as d3 from "d3";

/**
 * Funkcija za rešavanje problema putnog trgovca pomoću greedy algoritma
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
    "Počinjemo rešavanje problema putnog trgovca greedy algoritmom..."
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

      node.attr("fill", (d) => (visited.has(d.id) ? "red" : "black"));


    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  };
  

  // pokreni simulaciju
  d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink(links).distance(350))
    .on("tick", tick);


  // Create a Map object to store the list of edges leading to each unvisited node
  const unvisitedEdges = new Map<number, Array<[number, number, number]>>();

  while (result.length < n) {
    console.log(`Current result: ${result}`);

    // Find the minimum weight edge leading to an unvisited node
    let minWeight = Number.MAX_VALUE;
    let next: number | undefined;


    for (const [u, v, w] of E) {
      if (visited.has(u) && !visited.has(v)) {
        // If this is the first edge leading to the unvisited node v, add it to the Map
        if (!unvisitedEdges.has(v)) {
          unvisitedEdges.set(v, [[u, v, w]]);
        }
        // Otherwise, add the edge to the list of edges leading to the unvisited node v
        else {
          unvisitedEdges.get(v)!.push([u, v, w]);
        }
      }
    }
    // Choose the minimum weight edge leading to an unvisited node
    for (const [v, edges] of unvisitedEdges) {
      const weight = Math.min(...edges.map(([,, w]) => w));
      if (weight < minWeight) {
        minWeight = weight;
        next = v;
      }
    }
    /* console.log(
      `The minimum weight edge leading to an unvisited node is edge (${minEdge[0]}, ${minEdge[1]}) with weight ${minEdge[2]}`
    ); */

    if (next === undefined) {
      throw new Error("The graph is not connected");
    }

    /* if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    } */
    tick();
    
    result.push(next);
    visited.add(next);
    console.log(`Adding node ${next} to the result and marking it as visited`);
    // Clear the Map of unvisited edges
    unvisitedEdges.clear();
    // Update the list of unvisited edges
    for (const [u, v, w] of E) {
      if (visited.has(u) && !visited.has(v)) {
        unvisitedEdges.set(v, [[u, v, w]]);
      }
    }
    //await new Promise((resolve) => setTimeout(resolve, delay));
  }

  result.push(0); // dodajemo početni čvor na kraj

  // obojimo grane koje čine rešenje problema putnog trgovca u crveno
  let current = result[0];
  for (const next of result.slice(1)) {
    svg
      .selectAll(".link")
      .filter(
        (d: any) =>
          (d.source.id === current && d.target.id === next) ||
          (d.source.id === next && d.target.id === current)
      )
      .style("stroke", "red");

    current = next; // postavljamo trenutni čvor
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    } 
  }

  console.log(`Rešenje problema putnog trgovca je: ${result}`);

  return result;
}