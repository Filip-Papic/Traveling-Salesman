/**
 * Rešava problem putujućeg prodavca koristeći egzaktni algoritam.
 *
 * @param distances Matrica rastojanja između gradova.
 * @param start Početni grad.
 * @return Najkraća dužina puta i njegov redosled gradova.
 */
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
    console.log([minDistance, minTour]);
    // Vrati najkraću dužinu puta i njen redosled gradova
    return [minDistance, minTour];
  }