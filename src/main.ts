import "./style.css";
import {
  generateCompleteGraph,
  downloadCompleteGraph,
  drawCompleteGraph,
  generateGraph,
} from "./graphGenerator";
import { solveTSPExact } from "./tspExact";
import { solveTSPGreedy } from "./tspGreedy";
import { solveTSPGreedyDrop } from "./tspGreedyDrop";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="card">
      <h1>Traveling Salesman Problem</h1>
      <input type="number" id="n" placeholder="Number of nodes" min="5" max="1000" value="5">
      <button id="graphGenerator" type="button">Generate graph</button>
    </div>
    <div id="visualize">
      <div id="canvas">
        <canvas id="graph-canvas" width="500" height="500"></canvas>
      </div>
      <div id="graph"></div>
    </div>
`;

document
  .querySelector<HTMLButtonElement>("#graphGenerator")!
  .addEventListener("click", async () => {
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
    const graph = generateCompleteGraph(parseInt(n));
    //solveTSPExact(graph);
    //solveTSPGreedy(parseInt(n), graph, 1000);
    solveTSPGreedyDrop(parseInt(n), graph, 1000);
  });
