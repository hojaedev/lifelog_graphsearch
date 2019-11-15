
/*
* 1. root : 시멘틱 네트워크의 root node. init function에서 정의됨
* 2. gss : 사용하는 gss node들의 리스트.
* 3. nodeList : root, gss 노드를 제외한 모든 node들의 리스트
* 4. edgeList : 모든 edge들의 리스트
* 5. attributes : 현재 사용하고 있는 데이터셋의 모든 attribute들을 나타내는 리스트
*                 (차후에 있을 수 있는 수정에 대한 확장성을 고려함)
* */
function SNmanager(attributes){
    this.root = null;
    this.gss = {}; // dictionary로 gssNode객체 저장. key는 각 gss Node의 value.
    this.nodeDict = {}; // key는 [attribute, value] value는 node의 객체
    this.attributes = attributes;
}

//root,gss 노드들 생성 및 연결 -> 가장 기본적 SN구조 생성
SNmanager.prototype.init= function(){
    //root, gss 노드들 생성
    this.root = new Node('root','me');
    let gssList = ['food','sleep','activity'];
    for(let i=0; i<gssList.length; i++){
        let gssNode= new Node('gss', gssList[i]);
        this.gss[gssList[i]] = gssNode;
        // root와 gss노드들 연결
        this.addNode(this.root, gssNode);
    }
}

//SN을 생성한다.
//1. SclabUtil 객체의 readInputFile 함수로부터 받은 데이터셋을 입력으로 받는다.
//2. 데이터셋의 각 행에 대한 for문
    //2-1 첫번째 열 원소인 start-time에 대한 노드 생성 및 알맞은 gss노드와 연결(linkStartNode2gssNode 함수역할)
    //2-2 데이터 한 행의 각 열에 대한 for문
        //2-2-1 원소에 대한 노드가 존재하는지 확인
        //2-2-2 존재한다면 해당 노드 call
        //2-2-3 존재하지 않는다면 새로운 노드 생성
        //2-2-4 위에서 얻은노드와 startNode연결
SNmanager.prototype.makeSN = function(dataset){
    for(let idx=0; idx<dataset.length; idx++){
        let one_data = dataset[idx];
        let startNode = new Node(this.attributes[0],one_data[0]);
        this.nodeDict[this.attributes[0],one_data[0]] = startNode;
        let activityAttributeIndex = this.attributes.indexOf('activity'); // activity가 몇번째 컬럼에 있는지 찾기
        let targetGss = this.linkStartNode2gssNode(one_data[activityAttributeIndex]);
        this.addNode(targetGss, startNode);

        for(let j=0; j<(this.attributes.length-1); j++) {
            if(one_data[j+1] == '/' || one_data[j+1] == '') {
                continue;
            }
            let tmpNode = new Node(this.attributes[j+1], one_data[j+1]);
            if([this.attributes[j+1], one_data[j+1]] in this.nodeDict){
                continue;
            }
            this.nodeDict[this.attributes[j+1], one_data[j+1]] = tmpNode;
            this.addNode(startNode, tmpNode);
        }
    }
}

//두 노드간의 edge생성 + 두 노드들에 대한 부모,자식,엣지 정보 각 노드들에 저장
SNmanager.prototype.addNode = function(from, to){
    let edge = new Edge(from,to);

    from.children_list.push(to);
    to.parents_list.push(from);

    from.edge_list.push(edge);
    to.edge_list.push(edge);
}

//시작시간 노드(startNode)를 알맞은 gss node와 연결한다.
SNmanager.prototype.linkStartNode2gssNode = function(activity){
    //잠, 수면, 취침 이란 단어가 있으면서 준비 라는 단어가 없는 경우,
    if (activity.indexOf('잠')!=-1 || activity.indexOf('수면')!=-1 || activity.indexOf('취침')!=-1){
        return this.gss['sleep'];
    }
    if (activity.indexOf('식사')!=-1 || activity.indexOf('아침')!=-1 || activity.indexOf('점심')!=-1 || activity.indexOf('저녁')!=-1 || activity.indexOf('밥')!=-1){
        return this.gss['food'];
    }
    return this.gss['activity'];
}

//gss value, 시작시간의 (시간단위 까지의) 값, 그리고 attribute를 입력으로 받아서 해당 attribute에 대한 node들이 있는지 탐색함.
// 있다면 그 노드들의 값들을 return.
SNmanager.prototype.searchNode = function(gss, time, attribute){
    let gssNode = this.gss[gss];
    //시작노드들 중에서 그 시간대(YYYY-MM-DD-HH)에 있는 시작노드 list 들고옴.
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
    //각 시작노드에서 'attribute' 파라미터를 attribute로 가지는 노드의 값 + 종료시간 노드의 값을 시작 순서대로 리포팅
    let highlightedProperties = []; // 추후 확장성을 위하여 각 값 변수에 저장
    console.log(highlightedStartNodeList);
    for(let i=0; i < highlightedStartNodeList.length; i++) {
        let tmp_list = [];
        tmp_list.push(highlightedStartNodeList[i].value);
        tmp_list.push(highlightedStartNodeList[i].getChildByAttr('end_time').value);
        let atrResult = highlightedStartNodeList[i].getChildByAttr(attribute);
        if(atrResult != null){
            tmp_list.push(atrResult.value);
            highlightedProperties.push(tmp_list);
            console.log(`${tmp_list[0]} ~ ${tmp_list[1]} ~ ${tmp_list[2]}`);
        }
    }

    console.log(highlightedProperties);
    return highlightedProperties;
};

//네트워크 노드의 ID를 재귀적으로 탐색
SNmanager.prototype.getNodeById = function (id) {
    const search = (node) => {
        if (node.attribute + node.value === id) {
            return node
        }

        for (const child_node of node.children_list) {
            const found = search(child_node)

            if (found !== null) {
                return found
            }
        }

        return null
    }

    return search(this.root)
}