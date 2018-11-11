// startNode - designate a node to start search
// searchMode - 'dfs' or 'bfs'
// condition -

function GraphSearch(startNode, searchMode, searchCondition) {
    if(searchMode = 'bfs'){
        this.getChildByAttr(startNode, searchCondition);
    } else if(searchMode = 'dfs'){
        this.getChildByAttr(searchCondition)
    }
}
GraphSearch.prototype.BFS = function(startNode, searchCondition){
    // create a visited array
    let visited = [];
    for (let i = 0; i < this.noOfVertices; i++)
        visited[i] = false;

    // Create an object for queue
    let q = new Queue();

    // add the starting node to the queue
    visited[startNode] = true;
    q.enqueue(startingNode);

    // loop until queue is element
    while (!q.isEmpty()) {
        // get the element from the queue
        let getQueueElement = q.dequeue();

        // passing the current vertex to callback funtion
        console.log(getQueueElement);

        // get the adjacent list for current vertex
        let get_List = this.AdjList.get(getQueueElement);

        // loop through the list and add the elemnet to the
        // queue if it is not processed yet
        for (let i in get_List) {
            let neigh = get_List[i];

            if (!visited[neigh]) {
                visited[neigh] = true;
                q.enqueue(neigh);
            }
        }
    }

}

GraphSearch.prototype.DFS = function(searchCondition){
    var visited = [];
    for (var i = 0; i < this.noOfVertices; i++)
        visited[i] = false;

    this.DFSUtil(startingNode, visited);
}


// Recursive function which process and explore
// all the adjacent vertex of the vertex with which it is called
GraphSearch.prototype.DFSUtil(vert, visited){
    visited[vert] = true;
    console.log(vert);

    var get_neighbours = this.AdjList.get(vert);

    for (var i in get_neighbours) {
        var get_elem = get_neighbours[i];
        if (!visited[get_elem])
            this.DFSUtil(get_elem, visited);
    }
}
