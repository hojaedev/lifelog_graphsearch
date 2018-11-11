/*
* Created by wonsup
 *  */


let SclabUtil = {
    //한 csv파일에 대한 모든 데이터를 load하여 return한다.
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
    //SN을 생성할때 사용할 데이터셋을 만든다.
    readInputFile: function (startDate, days, dataIndex) {
        let totalDataset = []; // 네트워크 형성에 쓰일 최종 데이터셋
        let tmp_date = startDate.split('-');
        let seedDate = new Date(tmp_date[0], tmp_date[1] - 1, tmp_date[2]); // 기준날짜에 대한 date 객체를 얻는다.
        for (let i = 0; i < days; i++) { // SN생성에 사용할만큼 반복

            //참조할 데이터파일의 이름 생성
            let year = seedDate.getFullYear() + '';
            let month = SclabUtil.pad(seedDate.getMonth() + 1, 2) + '';
            let day = SclabUtil.pad(seedDate.getDate(), 2) + '';
            let fileName = year + month + day + '_' + SclabUtil.pad(dataIndex, 3); // 생성된 파일 이름

            //파일 이름에 해당하는 csv파일의 모든 데이터셋을 로드하여 totalDataset에 concatenate한다
            let oneDataset = (this.getdata(fileName)).responseText;
            oneDataset = $.csv.toArrays(oneDataset);
            if (i > 0) {
                oneDataset.shift();
            }
            totalDataset = totalDataset.concat(oneDataset);
           // console.log(totalDataset.length); // 데이터셋 잘들어가는지 디버깅용으로 찍어줌
            seedDate.setDate(seedDate.getDate() + 1); // *날짜를 하루씩 늘려줌*
        }
        //각 행마다 for문
        let startTimeIndex = totalDataset[0].indexOf('start_time');
        let endTimeIndex = totalDataset[0].indexOf('end_time');
        for (let i = 1; i < totalDataset.length - 1; i++) { // i==0은 attribute 행임
            //종료시간 24:00인경우
            let endTimeString = totalDataset[i][endTimeIndex].split(' ')[1];
            if (endTimeString == '00:00' || endTimeString == '24:00' || endTimeString == '23:59') {
                let isSame = true;
                for (let j = 0; j < totalDataset[0].length; j++) {
                    //다음 행과 현재 행에 대한 시간을 제외한 모든 값들이 동일하다면 합치기
                    if (j != startTimeIndex && j != endTimeIndex) {
                        if (totalDataset[i][j] != totalDataset[i + 1][j]) {
                            isSame = false;
                        }
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
    //파이썬의 zfill 함수와 같은 기능하는 함수. ex) pad(123,5) --> 00123
    pad: function (n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
}