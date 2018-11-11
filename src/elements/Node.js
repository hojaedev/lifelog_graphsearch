/*
* Created by wonsup
 *  */

/*
* 1. attribute : 데이터셋에서의 attribute ex) place, activity 등
* 2. value : attribute의 값 ex) 학교, 집, 청소 등
* 3. parents_list : 현재 노드의 부모노드 리스트
* 4. children_list : 현재 노드의 자식노드 리스트
* 5. edge_list :  현재 노드와 연결된 모든 엣지 리스트
* */
function Node(attribute, value) {
    this.attribute = attribute;
    this.value = value;
    this.parents_list = [];
    this.children_list = [];
    this.edge_list = [];
}

Node.prototype.getChildByAttr = function(attribute){
    //자식중 parameter와 동일한 attribute를 가지는 자식이 있다면 return
    for(var i=0; i<this.children_list.length; i++){
        if(this.children_list[i].attribute == attribute){
            return this.children_list[i];
        }
    }
    return null;
}

