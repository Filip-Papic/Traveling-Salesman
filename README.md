# Traveling Salesman Problem (TSP)

To run the program, use:

    npm install
    npm run dev

Also use inspect function in browser (console) to see the algorithms in action.

## KTG-Assigment

Let a complete undirected graph G = G(V,E), where |V| = n.
In an arbitrary programming language, the following should be done:

1. Write a function that generates an arbitrary complete graph with n nodes, where 5 <= n <= 1000.
   Save generated graphs in csv format (or another format that can be opened as a table)

2. You want to solve the traveling salesman problem (TSP), for that you will propose 3 algorithms:

   1. exact - the one who will make a list of all possible tours and choose the shortest one
   2. greedy - the algorithm that will greedily construct the contour by adding only the shortest edges
   3. greedy drop - starting from some random permutation (TSP solutions), the algorithm will throw out the longest edges and thus arrive at a solution

3. Graphically present your algorithms, as well as graph G. This should explain to the user how your code works and follow how you came to the solution.

4. Write a report of 6-8 pages:
   a) describe the problem
   b) describe the algorithms
    i) create a table in which you compare the execution time of each algorithm and solution (see example)
    ii) describe the asymptotic complexity of the algorithm
    iii) a short conclusion about this empirical analysis
