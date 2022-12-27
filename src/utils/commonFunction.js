// 公共函数

// 将数组转换成字符串（后台接收和发出的数组用字符串加逗号形式的）
export function array2myString(pArray) {
    let retStr = ""
    if (pArray === null || pArray === undefined) {
        return retStr
    }
    if (pArray.length > 0) {
        pArray.forEach(element => {
            retStr += element + ','
        })
    }
    if (retStr.lastIndexOf(',') > -1) {
        retStr = retStr.substring(0, retStr.length - 1)
    }
    return retStr
}

// 将字符串转换成数组（后台接收和发出的数组用字符串加逗号形式的）
export function myString2Array(pString) {
    let retArray = []
    if (pString === null || pString === undefined) {
        return retArray
    }
    let tempArray = pString.split(',')
    tempArray.forEach(element => {
        retArray.push(Number(element))
    })
    return retArray;
}

// 表格第一列左侧留空
export function columnStyle({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 0) {
        return 'padding-left:20px;align:left;';
    }
}

// 表头样式
export function heaerCellStyle() {
    return { color: '#444', fontSize: '16px', backgroundColor: '#F3F6FC' }
}

// 下载文件
export function downloadFile(url, fileName) {
    try {
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "blob";
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                if (typeof window.chrome !== 'undefined') {
                    // Chrome version
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(req.response);
                    link.download = fileName;
                    link.click();
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE version
                    var blob = new Blob([req.response], { type: 'application/force-download' });
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    // Firefox version
                    var file = new File([req.response], fileName, { type: 'application/force-download' });
                    window.open(URL.createObjectURL(file));
                }
            }
            if (req.readyState === 4 && req.status !== 200) {
                console.log('错误信息：<br/>' + req.status + '<br/>' + req.statusText);
            }
        };
    }
    catch (error) {
        console.log(error)
    }
}
