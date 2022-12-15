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

// 将内容是带引号的文本格式数字数组转换成纯数字数组
export function myStringArr2NumArr(pArray) {
    let retArray = []
    if (pArray === null || pArray.length < 1) {
        return retArray
    }
    pArray.forEach(element => {
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