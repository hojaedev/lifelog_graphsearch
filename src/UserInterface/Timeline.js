/*
* Created by wonsup
 *  */


//현재 기능: 로드된 데이터셋에 대한 모든 timeline을 제공함.
function Timeline(){
    this.groups = new vis.DataSet([
        {id: 1, content: 'Sleep', value: 1},
        {id: 0, content: 'Eating', value: 2},
        {id: 2, content: 'Activity', value: 3},
    ]);
    this.items = new vis.DataSet();
    this.options = {
        groupOrder: function(a, b){
            return a.value - b.value;
        },
        autoResize: false,
        stack: false,
        zoomMin: 1000 * 60 * 60, // 60분
        zoomMax: 1000 * 60 * 60 * 24 * 50 // 50일
    };
    this.timeline = null;
}

Timeline.prototype.init = function(gssDict){
    // items 초기화
    this.items = new vis.DataSet();
    // count == 0 (id용)
    let count = 0;
    //Gss 3개 에 대한 for문
    //gss_value = {0,1,2} (group 프로퍼티에 들어감)
    if (gssDict == null){
        return;
    }
    for(let gss_value=0; gss_value < Object.values(gssDict).length; gss_value++) {
        let tmp_gss = (Object.values(gssDict))[gss_value];
        //시작시간에 대한 for문
        for(let st_idx=0; st_idx<tmp_gss.children_list.length; st_idx++) {
            let tmp_st_date = tmp_gss.children_list[st_idx];
            //start_time = new Date(시작시간)
            let start_time = new Date(tmp_st_date.value);
            //end_time = new Date(종료시간)
            let tmp_end_date = tmp_st_date.getChildByAttr('end_time');
            if(tmp_end_date == null){
                alert('end_time is null!');
            }
            let end_time = new Date(tmp_end_date.value);
            //activity_value = 행동  (end time 값, activity값 받고)
            let tmp_activity = tmp_st_date.getChildByAttr('activity');
            if(tmp_activity == null){
                alert('activity is null!');
            }
            this.items.add([
                {id: count, group: gss_value, content: tmp_activity.value, start: start_time, end: end_time}
            ]);
            count = count + 1;
        }
    }
}
Timeline.prototype.draw = function(container) {
    this.timeline = new vis.Timeline(container);
    this.timeline.setOptions(this.options);
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.items);
}

Timeline.prototype.destroy = function(){
    this.timeline.destroy();
}
