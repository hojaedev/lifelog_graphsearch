/*
* Created by wonsup
 *  */

/*
* 1. from : edge에서 부모에 해당하는 노드
* 2. to : 현재 edge에서 자식에 해당하는 노드
* 3. weight : edge의 weight (현재 사용 x)
* */
function Edge(from, to){
    this.from = from;
    this.to = to;
    this.weight = 1;
}
