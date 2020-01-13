/*

    Author - John H. Yoon
*/

/*    
    * 1. root :         Root node of the semantic network
    * 2. gss :          List of all available gss
    * 3. nodeList :     List of all nodes except root and gss
    * 4. edgeList :     List of all edges
    * 5. attributes :   List of all atrributes used in the created network. 

*/


function SNmanager(attributes){

    this.root = null;
    this.gss = {}; 
    this.nodeDict = {}; 
    this.attributes = attributes;

}

//Factory function to initialize and connect root/gss nodes
SNmanager.prototype.init= function(){
    
    this.root = new Node('root','me');
    let gssList = ['food','sleep','activity'];

    for(let i=0; i<gssList.length; i++){

        let gssNode= new Node('gss', gssList[i]);
        this.gss[gssList[i]] = gssNode;
        // connect root and gss
        this.addNode(this.root, gssNode);

    }

}

SNmanager.prototype.makeSN = function(dataset){

    for(let idx=0; idx<dataset.length; idx++){

        let one_data = dataset[idx];
        let startNode = new Node(this.attributes[0],one_data[0]);
        this.nodeDict[this.attributes[0],one_data[0]] = startNode;
        let activityAttributeIndex = this.attributes.indexOf('activity'); 
        let targetGss = this.linkStartNode2gssNode(one_data[activityAttributeIndex]);
        this.addNode(targetGss, startNode);

        for(let j=0; j<(this.attributes.length-1); j++) {

            if(one_data[j+1] == '/' || one_data[j+1] == '') continue;

            let tmpNode = new Node(this.attributes[j+1], one_data[j+1]);

            if([this.attributes[j+1], one_data[j+1]] in this.nodeDict) continue;

            this.nodeDict[this.attributes[j+1], one_data[j+1]] = tmpNode;
            this.addNode(startNode, tmpNode);

        }

    }
    
}

// Create an edge between two nodes and save parent, child, edge information of each node
SNmanager.prototype.addNode = function(from, to){
    let edge = new Edge(from,to);

    from.children_list.push(to);
    to.parents_list.push(from);

    from.edge_list.push(edge);
    to.edge_list.push(edge);
}

// Connect the startNode with matching gss node
SNmanager.prototype.linkStartNode2gssNode = function(activity){
    
    if (activity.indexOf('잠')!=-1 || activity.indexOf('수면')!=-1 || activity.indexOf('취침')!=-1){
        return this.gss['sleep'];
    }
    if (activity.indexOf('식사')!=-1 || activity.indexOf('아침')!=-1 || activity.indexOf('점심')!=-1 || activity.indexOf('저녁')!=-1 || activity.indexOf('밥')!=-1){
        return this.gss['food'];
    }
    return this.gss['activity'];
}

SNmanager.prototype.searchNode = function(gss, time, attribute){

    let gssNode = this.gss[gss];
    let query_split =  time.split("-");
    let query_date = query_split[0] + "-" + query_split[1] + "-" + query_split[2];
    let query_hour = query_split[3];

    let highlightedStartNodeList = [];

    for(let i=0; i < gssNode.children_list.length; i++){
        let node_split = gssNode.children_list[i].value.split(" ");// 0: date, 1: hh:mm:ss
        let node_hour = node_split[1].split(":");
        node_hour = node_hour[0]
        if(query_date == node_split[0] && query_hour == node_hour){
            highlightedStartNodeList.push(gssNode.children_list[i]);
        }
    }
    
    let highlightedProperties = [];
    
    for(let i=0; i < highlightedStartNodeList.length; i++) {

        let tmp_list = [];
        tmp_list.push(highlightedStartNodeList[i].value);
        tmp_list.push(highlightedStartNodeList[i].getChildByAttr('end_time').value);
        let atrResult = highlightedStartNodeList[i].getChildByAttr(attribute);

        if(atrResult != null) {

            tmp_list.push(atrResult.value);
            highlightedProperties.push(tmp_list);
            console.log(`${tmp_list[0]} ~ ${tmp_list[1]} ~ ${tmp_list[2]}`);

        }

    }

    return highlightedProperties;
};

// Recursively search nodes by NodeID
SNmanager.prototype.getNodeById = function (id) {

    const search = (node) => {

        if (node.attribute + node.value === id) return node;

        for (const child_node of node.children_list) {

            const found = search(child_node)

            if (found !== null) return found;

        }

        return null;

    }

    return search(this.root);

}