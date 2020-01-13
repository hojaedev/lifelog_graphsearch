/*

    Author - John H. Yoon

*/

// startNode - designate a node to start search
// searchMode - 'dfs' or 'bfs'

function GraphSearch(startNode, searchMode, searchCondition) {

    if(searchMode = 'bfs'){

        this.getChildByAttr(startNode, searchCondition);

    } else if(searchMode = 'dfs'){

        this.getChildByAttr(searchCondition)

    }

}

// BFS implementation
GraphSearch.prototype.BFS = function(startNode, searchCondition){

    // create a visited array
    let visited = [];

    for (let i = 0; i < this.noOfVertices; i++) visited[i] = false;

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

            let neighbor = get_List[i];

            if (!visited[neighbor]) {

                visited[neighbor] = true;
                q.enqueue(neighbor);

            }

        }

    }

}

// DFS implementation
GraphSearch.prototype.DFS = function(searchCondition){

    var visited = [];

    for (var i = 0; i < this.noOfVertices; i++)
        visited[i] = false;

    this.DFSUtil(startingNode, visited);

}


// Recursive function that processes and explores
// all adjacent vertices of the vertex
GraphSearch.prototype.DFSUtil(vert, visited){

    visited[vert] = true;

    var get_neighbours = this.AdjList.get(vert);

    for (var i in get_neighbours) {

        var get_elem = get_neighbours[i];

        if (!visited[get_elem])
            this.DFSUtil(get_elem, visited);

    }

}
