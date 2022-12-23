/**
 * Ovaj funkcija vraća najkraći moguće ture za date grane koristeći tačan algoritam za problem putujućeg trgovca (TSP).
 * @param edges Niz grana sa njihovim težinama, gdje je svaka grana predstavljena nizom od dva elementa: početna čvor i krajnja čvor, a težina je udaljenost između njih.
 * @returns Niz koji predstavlja najkraću moguću turu, uključujući početni i krajnji čvor i ukupnu udaljenost.
 */
export function solveTSPExact(
  edges: [number, number, number][]
): [number[], number] {
  // Pronađi ukupan broj čvorova u grafu.
  const numNodes = Math.max(...edges.map(([, node]) => node)) + 1;
  // Generiši sve moguće ture grafa.
  // Počinjemo turu na čvoru 0, pa prosleđujemo 0 kao prvi element u nizu permutacije.
  const tours = generatePermutations([0], numNodes);

  // Pronađi najkraću turu.
  let minTour: number[] = [];
  let minDistance = Infinity;
  for (const tour of tours) {
    // Izračunaj ukupnu udaljenost za ovu turu.
    let distance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
      // Pronađi granu između trenutnog čvora i sledećeg čvora u turi.
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
    // Proveri da li je ova tura trenutno najkraća.
    if (distance < minDistance) {
      minTour = tour;
      minDistance = distance;
    }
  }

  console.log(`Shortest tour: ${minTour}`);
  console.log(`Total distance: ${minDistance}`);

  // Vrati najkraću turu i ukupnu udaljenost.
  return [minTour, minDistance];
}

/**
 * Ovaj je pomoćna funkcija koja generiše sve permutacije datog niza.
 * @param arr Niz za koji se generišu permutacije.
 * @param n Dužina permutacija.
 * @returns Niz koji sadrži sve permutacije datog niza.
 */
function generatePermutations(arr: number[], n: number): number[][] {
  const perms: number[][] = [];
  if (arr.length === n) {
    // Ako je niz tačne dužine, dodaj ga u listu permutacija.
    perms.push(arr);
  } else {
    // U suprotnom, generiši sve permutacije koje se mogu formirati dodavanjem jednog od preostalih brojeva u niz.
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
