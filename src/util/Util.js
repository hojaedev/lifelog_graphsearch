/*

    Author - John H. Yoon

*/

let SclabUtil = {
    
    getdata: function (fileName) {
        return $.ajax({
            url: '../data/' + fileName + '.csv',
            datatype: 'text',
            async: false,
            success: function (data) {
                let allRows = data.split(/\r?\n|\r/);
                return allRows;
            }
        });
    },
    
    readInputFile: function (startDate, days, dataIndex) {
        let totalDataset = [];
        let tmp_date = startDate.split('-');
        let seedDate = new Date(tmp_date[0], tmp_date[1] - 1, tmp_date[2]);
        for (let i = 0; i < days; i++) {

            
            let year = seedDate.getFullYear() + '';
            let month = SclabUtil.pad(seedDate.getMonth() + 1, 2) + '';
            let day = SclabUtil.pad(seedDate.getDate(), 2) + '';
            let fileName = year + month + day + '_' + SclabUtil.pad(dataIndex, 3);

            let oneDataset = (this.getdata(fileName)).responseText;
            oneDataset = $.csv.toArrays(oneDataset);

            if (i > 0) oneDataset.shift();

            totalDataset = totalDataset.concat(oneDataset);
            seedDate.setDate(seedDate.getDate() + 1); 
        }
        
        let startTimeIndex = totalDataset[0].indexOf('start_time');
        let endTimeIndex = totalDataset[0].indexOf('end_time');
        for (let i = 1; i < totalDataset.length - 1; i++) {
            
            let endTimeString = totalDataset[i][endTimeIndex].split(' ')[1];
            if (endTimeString == '00:00' || endTimeString == '24:00' || endTimeString == '23:59') {
                let isSame = true;
                for (let j = 0; j < totalDataset[0].length; j++) {

                    if (j != startTimeIndex && j != endTimeIndex) {

                        if (totalDataset[i][j] != totalDataset[i + 1][j]) isSame = false;
                    }

                }
                if (isSame) {

                    totalDataset[i][endTimeIndex] = totalDataset[i + 1][endTimeIndex];
                    totalDataset.splice(i + 1, 1);

                }
            }
        }
        return totalDataset;
    },
    
    pad: function (n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
}