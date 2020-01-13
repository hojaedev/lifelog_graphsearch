/*

    Author - John H. Yoon

*/


// Service all applicable timeline functions
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
        zoomMin: 1000 * 60 * 60, // 60min
        zoomMax: 1000 * 60 * 60 * 24 * 50 // 50days
    };
    this.timeline = null;
}

Timeline.prototype.init = function(gssDict){
    // initialize items
    this.items = new vis.DataSet();
    // count == 0 (id)
    let count = 0;
    // 3 for loops for gss
    // gss_value = {0,1,2} (group porperty)
    if (gssDict == null) return null;

    for(let gss_value=0; gss_value < Object.values(gssDict).length; gss_value++) {

        let tmp_gss = (Object.values(gssDict))[gss_value];
        // for loop for start time
        for(let st_idx=0; st_idx<tmp_gss.children_list.length; st_idx++) {
            let tmp_st_date = tmp_gss.children_list[st_idx];
            let start_time = new Date(tmp_st_date.value);
            let tmp_end_date = tmp_st_date.getChildByAttr('end_time');

            if(tmp_end_date == null) alert('end_time is null');

            let end_time = new Date(tmp_end_date.value);
            let tmp_activity = tmp_st_date.getChildByAttr('activity');

            if(tmp_activity == null) alert('activity is null!');

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
