import "./style.css";
import { generateCompleteGraph, downloadCompleteGraph, drawCompleteGraph } from "./graphGenerator";
import { solveTSPExact } from "./tspExact";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div class="card">
      <h1>Traveling Salesman Problem</h1>
      <input type="number" id="n" placeholder="Number of nodes" min="5" max="1000" value="10">
      <button id="graphGenerator" type="button">Generate graph</button>
    </div>
    <canvas id="graph-canvas" width="500" height="500"></canvas>
  </div>
`;

document
  .querySelector<HTMLButtonElement>("#graphGenerator")!
  .addEventListener("click", () => {
    const n = document.querySelector<HTMLInputElement>("#n")!.value;
    const canvas = document.querySelector<HTMLCanvasElement>("#graph-canvas")!;

    if (n === "") {
      alert("Number of nodes is required");
      return;
    } else if (parseInt(n) < 5) {
      alert("Number of nodes must be 5 or greater");
      return;
    } else if (parseInt(n) > 1000) {
      alert("Number of nodes must be 1000 or less");
      return;
    }
    //downloadCompleteGraph(parseInt(n));
    drawCompleteGraph(parseInt(n), canvas);
    solveTSPExact(parseInt(n), 0);
  });