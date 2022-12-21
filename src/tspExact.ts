/**
 * This function returns the shortest possible tour for the given edges using the exact algorithm for the Traveling Salesman Problem (TSP).
 * @param edges An array of edges with their weights, where each edge is represented as an array with two elements: the starting node and the ending node, and the weight is the distance between them.
 * @returns An array representing the shortest possible tour, including the starting and ending nodes and the total distance.
 */
export function solveTSPExact(
  edges: [number, number, number][]
): [number[], number] {
  // Find the total number of nodes in the graph.
  const numNodes = Math.max(...edges.map(([, node]) => node)) + 1;

  // Generate all possible tours of the graph.
  // We start the tour at node 0, so we pass 0 as the first element in the permutation array.
  const tours = generatePermutations([0], numNodes);

  // Find the shortest tour.
  let minTour: number[] = [];
  let minDistance = Infinity;
  for (const tour of tours) {
    // Calculate the total distance for this tour.
    let distance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
      // Find the edge between the current node and the next node in the tour.
      const edge = edges.find(
        ([node1, node2]) =>
          (node1 === tour[i] && node2 === tour[i + 1]) ||
          (node1 === tour[i + 1] && node2 === tour[i])
      );
      if (edge) {
        distance += edge[2];
      } else {
        throw new Error(
          `Edge not found for nodes ${tour[i]} and ${tour[i + 1]}`
        );
      }
    }
    // Check if this tour is the shortest one so far.
    if (distance < minDistance) {
      minTour = tour;
      minDistance = distance;
    }
  }

  console.log(`Shortest tour: ${minTour}`);
  console.log(`Total distance: ${minDistance}`);
  
  // Return the shortest tour and the total distance.
  return [minTour, minDistance];
}

/**
 * This is a helper function that generates all permutations of the given array.
 * @param arr The array to generate permutations for.
 * @param n The length of the permutations.
 * @returns An array containing all permutations of the given array.
 */
function generatePermutations(arr: number[], n: number): number[][] {
  const perms: number[][] = [];
  if (arr.length === n) {
    // If the array is the correct length, add it to the list of permutations.
    perms.push(arr);
  } else {
    // Otherwise, generate all permutations that can be formed by adding one of the remaining numbers to the array.
    for (let i = 1; i < n; i++) {
      if (arr.includes(i)) {
        continue;
      }
      perms.push(...generatePermutations([...arr, i], n));
    }
  }
  return perms;
}

/**
 * Rešava problem putujućeg prodavca koristeći egzaktni algoritam.
 *
 * @param distances Matrica rastojanja između gradova.
 * @param start Početni grad.
 * @return Najkraća dužina puta i njegov redosled gradova.
 */

/* 
export function solveTSPExact(distances: number[][], start: number): [number, number[]] {
    // Broj gradova/čvorova u grafu
    const n = distances.length;
  
    // Niz u koji ćemo smestiti sve moguće permutacije gradova
    const permutations: number[][] = [];
  
    // Generiši sve permutacije gradova
    function permute(arr: number[], index: number = 0) {
      if (index === n) {
        permutations.push([...arr]);
      } else {
        for (let i = index; i < n; i++) {
          [arr[index], arr[i]] = [arr[i], arr[index]];
          permute(arr, index + 1);
          [arr[index], arr[i]] = [arr[i], arr[index]];
        }
      }
    }
  
    // Počni rekurziju sa nizom koji sadrži sve gradove u početnom redosledu
    permute([...Array(n).keys()]);
  
    // Inicijalizuj najkraću dužinu puta i njen redosled gradova
    let minDistance = Infinity;
    let minTour: number[] = [];
  
    // Prođi kroz sve permutacije i pronađi najkraći put
    for (const permutation of permutations) {
      let distance = 0;
  
      // Dodaj rastojanje između svake dve susjedne tačke u permutaciji
      for (let i = 0; i < n - 1; i++) {
        distance += distances[permutation[i]][permutation[i + 1]];
      }
  
      // Dodaj rastojanje između početne i završne tačke
      distance += distances[permutation[n - 1]][permutation[0]];
  
      // Ako je ovaj put kraći od trenutnog najkraćeg, zapamti ga
      if (distance < minDistance) {
        minDistance = distance;
        minTour = permutation;
      }
    }

    // Vrati najkraću dužinu puta i njen redosled gradova
    return [minDistance, minTour];
  } */
