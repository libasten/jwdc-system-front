// 公共函数
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