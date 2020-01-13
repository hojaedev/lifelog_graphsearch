// Node structure
function Node(attribute, value) {

    this.attribute = attribute;
    this.value = value;
    this.parents_list = [];
    this.children_list = [];
    this.edge_list = [];

}

// Return a child, if there exists one, that has the same parameter attributes
Node.prototype.getChildByAttr = function(attribute){
    
    for(var i=0; i<this.children_list.length; i++){

        if(this.children_list[i].attribute == attribute){

            return this.children_list[i];

        }

    }

    return null;

}

