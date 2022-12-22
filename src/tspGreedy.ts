/**
 * Funkcija za rešavanje problema putnog trgovca pomoću grubog algoritma
 * Ulazni parametri:
 * n: broj čvorova u grafu
 * E: lista grana u grafu, predstavljena kao trojke (u, v, w) gde je u i v čvorovi, a w težina grana (u, v)
 * Izlaz:
 * Niz čvorova predstavljajući minimalni put koji obilazi sve čvorove jednom
 */
export function solveTSPGreedy(
  n: number,
  E: Array<[number, number, number]>
): Array<number> {
  // Lista u kojoj ćemo čuvati rezultat
  const result: Array<number> = [0];
  // Skup posećenih čvorova
  const visited = new Set([0]);
  // Dok god imamo manje čvorova u rezultatu nego što ih ima u grafu, nastavljamo sa dodavanjem čvorova
  while (result.length < n) {
    // Postavljamo minimalnu težinu na veoma veliku vrednost
    let minWeight = Number.MAX_VALUE;
    // Promenljiva u kojoj ćemo čuvati sledeći čvor koji ćemo dodati u rezultat
    let next: number | undefined;
    // Prolazimo kroz sve bridove
    for (const [u, v, w] of E) {
      // Ako je u posećen, a v nije, i ako je težina grana (u, v) manja od trenutne minimalne težine, ažuriramo minimalnu težinu i čuvamo v kao sledeći čvor
      if (visited.has(u) && !visited.has(v) && w < minWeight) {
        minWeight = w;
        next = v;
      }
    }
    // Ako nismo pronašli sledeći čvor, graf nije povezan i bacamo izuzetak
    if (next === undefined) {
      throw new Error("Graf nije povezan");
    }
    // Dodajemo sledeći čvor u rezultat i označavamo ga kao posećen
    result.push(next);
    visited.add(next);
  }

  console.log(`Shortest tour: ${result}`);
  console.log(
    `Total distance: ${result.reduce((acc, curr, i) => {
      if (i === 0) {
        return 0;
      }
      const edge = E.find(
        ([u, v]) =>
          (u === curr && v === result[i - 1]) ||
          (u === result[i - 1] && v === curr)
      );
      if (edge) {
        return acc + edge[2];
      } else {
        throw new Error(
          `Edge not found for nodes ${curr} and ${result[i - 1]}`
        );
      }
    }, 0)}`
  );

  // Vraćamo rezultat kao minimalni put koji obilazi sve čvorove jednom
  return result;
}
