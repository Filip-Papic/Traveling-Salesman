import "./style.css";
import {
  generateCompleteGraph,
  downloadCompleteGraph,
  drawCompleteGraph
} from "./graphGenerator";
import { solveTSPExact } from "./algorithms/tspExact";
import { solveTSPGreedy } from "./algorithms/tspGreedy";
import { solveTSPGreedyDrop } from "./algorithms/tspGreedyDrop";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="card">
      <h1>Traveling Salesman Problem</h1>
      <label for="n">Number of nodes</label>
      <input type="number" id="n" placeholder="Number of nodes" min="5" max="1000" value="20">
      <label for="delay">Delay (ms)</label>
      <input type="number" id="delay" placeholder="Delay (ms)" min="0" max="100000" value="0" step="1000">
      <select id="algorithm">
        <option value="exact">Exact</option>
        <option value="greedy">Greedy</option>
        <option value="greedyDrop">Greedy drop</option>
      </select>
      <button id="graphGenerator" type="button">Generate</button>
      <button id="reset" type="button">Reset</button>
      <button id="download" type="button">Download</button>
    </div>
    <div id="visualize">
      <div id="canvas">
        <canvas id="graph-canvas" width="500" height="500"></canvas>
      </div>
      <div id="graph"></div>
    </div>
`;

const generate = document.querySelector<HTMLButtonElement>("#graphGenerator")!;
const reset = document.querySelector<HTMLButtonElement>("#reset")!;
const download = document.querySelector<HTMLButtonElement>("#download")!;
reset.disabled = true;

function isDisabled(bool: boolean) {
  generate.disabled = bool;
  reset.disabled = !bool;
}

generate.addEventListener("click", async () => {
  isDisabled(true);
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

  const delay = parseInt(
    document.querySelector<HTMLInputElement>("#delay")!.value
  );

  const algorithm =
    document.querySelector<HTMLSelectElement>("#algorithm")!.value;

  const graph = generateCompleteGraph(parseInt(n));

  download.addEventListener("click", () => {
    downloadCompleteGraph(graph);
  });

  //drawCompleteGraph(parseInt(n), canvas);
  let startTime = performance.now();
  if (algorithm === "exact") {
    solveTSPExact(parseInt(n), graph, delay);
  } else if (algorithm === "greedy") {
    solveTSPGreedy(parseInt(n), graph, delay);
  } else if (algorithm === "greedyDrop") {
    solveTSPGreedyDrop(parseInt(n), graph, delay);
  }
  let endTime = performance.now();

  console.log("Vreme izvršavanja:" + (endTime - startTime) / 1000 + " sekunde");
});

reset.addEventListener("click", () => {
  isDisabled(false);
  document.querySelector<HTMLDivElement>("#graph")!.innerHTML = "";
});
