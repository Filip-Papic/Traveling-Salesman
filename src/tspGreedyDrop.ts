/**
 * Greedy drop algoritam za rešavanje TSP problema
 * @param edges Grane grafa i njihove težine
 * @param n Broj čvorova u grafu
 * @returns Rešenje TSP problema
 */
export function solveTSPGreedyDrop(
  edges: [number, number, number][],
  n: number
): [number, number, number][] {
  const permutation = initializePermutation(n);
  // Niz za skladištenje rešenja TSP-a
  const solution: [number, number, number][] = [];

  // Iterirajte kroz permutaciju cvorova
  for (let i = 0; i < permutation.length - 1; i++) {
    // Pronađite granu između trenutnog i sledećeg cvora u permutaciji
    const edge = findEdge(edges, permutation[i], permutation[i + 1]);

    // Uklonite granu iz niza sa granama
    edges = edges.filter((e) => !(e[0] === edge[0] && e[1] === edge[1]));

    // Dodajte granu u rešenje TSP-a
    solution.push(edge);
  }

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
