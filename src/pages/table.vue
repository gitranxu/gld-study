<template>
    <div class="tables">
        <!-- <table>
            <tbody>
                <tr>
                    <td
                        colspan="3">01</td>
                    <td>02</td>
                    <td>03</td>
                    <td>04</td>
                </tr>
                <tr>
                    <td
                        rowspan="2">11</td>
                    <td>12</td>
                    <td>13</td>
                    <td>14</td>
                </tr>
                <tr>
                    <td>21</td>
                    <td>22</td>
                    <td>23</td>
                    <td>24</td>
                </tr>
            </tbody>
        </table> -->
        <table>
            <tbody>
                <tr
                    v-for="(row, rowIndex) in tableJson.rows"
                    :key="row.id">
                    <td
                        v-for="col in computedCols(row.cols)"
                        :key="col.id"
                        :colspan="col.colspan"
                        :rowspan="col.rowspan"
                        :class="getTdClass(col)"
                        @click="clickTd(col, rowIndex, row)">
                        {{ col.text + ',' + col.selected }}
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="margin-top: 60px;">
            <tbody>
                <tr
                    v-for="row in tableJson.rows"
                    :key="row.id">
                    <td
                        v-for="col in row.cols"
                        :key="col.id">
                        {{ col.text + ',' + col.selected }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="btn" @click="mergeCol" :class="getClass()">合并</div>
        <div class="btn" @click="splitCol" :class="getSplitClass()">拆分</div>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    created() {
        this.getData();
    },
    data() {
        return {
            tableJson: {
                rows: [
                    {
                        id: "0",
                        cols: [
                            {
                                text: "01",
                                id: "01",
                                colspan: "3",
                            },
                            {
                                text: "02",
                                id: "02",
                                hidden: true,
                            },
                            {
                                text: "03",
                                id: "03",
                                hidden: true,
                            },
                            {
                                text: "04",
                                id: "04",
                            },
                        ],
                    },
                    {
                        id: "1",
                        cols: [
                            {
                                text: "11",
                                id: "11",
                                colspan: "2",
                                rowspan: "2",
                            },
                            {
                                text: "12",
                                id: "12",
                                hidden: true,
                                // rowspan: "2",
                            },
                            {
                                text: "13",
                                id: "13",
                            },
                            {
                                text: "14",
                                id: "14",
                            },
                        ],
                    },
                    {
                        id: "2",
                        cols: [
                            {
                                text: "21",
                                id: "21",
                                hidden: true,
                            },
                            {
                                text: "220",
                                id: "22",
                                hidden: true,
                            },
                            {
                                text: "230",
                                id: "23",
                            },
                            {
                                text: "24",
                                id: "24",
                            },
                        ],
                    },
                ],
            },
        };
    },
    methods: {
        getData() {
            this.adapteData(this.tableJson);
        },
        adapteData(data) {
            /**
             * 作用是为后台返回的数据进行一定程度的加工
             * 如果没有colspan则设置一个,值为1
             * 如果没有rowspan则设置一个,值为1
             */
            data.rows.forEach(row => {
                row.cols.forEach(col => {
                    col.colspan = col.colspan || 1;
                    col.rowspan = col.rowspan || 1;
                });
            });
        },
        computedCols(cols) {
            return cols.filter(item => {
                return item.hidden != true;
            });
        },
        clickTd(col, rowIndex, row) {
            //console.log("rowIndex", rowIndex);
            const list = this.getListByRowspanAndColspan(col, rowIndex, row);
            list.forEach(col => {
                this.$set(col, "selected", !col.selected);
            });
            //this.$set(col, "clicked", !col.clicked);
        },
        // 根据rowspan,colspan得到对象集合
        getListByRowspanAndColspan(col, rowIndex, row) {
            /**
             * 1.根据rowspan及rowIndex得到行集合
             * 2.根据colspan及当前列索引取出对应的对象集合
             */
            let result = [];
            let rows = [];
            // col.rowspan = col.rowspan || 1;
            // col.colspan = col.colspan || 1;
            for (let i = 0; i < col.rowspan; i++) {
                // console.log("i", i + rowIndex);
                rows.push(this.tableJson.rows[i + rowIndex])
            }
            let colIndex = row.cols.findIndex(item => item.id === col.id);
            // console.log("colIndex", colIndex);
            rows.forEach(row => {
                for (let i = 0; i < col.colspan; i++) {
                    // console.log("i", i + rowIndex);
                    result.push(row.cols[i + colIndex])
                }
            });
            //console.log("result", result);
            return result;
        },
        getSelectedData() {
            /**
             * 对后端返回的tableJson进行一个过滤,只保留selected为true的数据
             * 这里有一个细节,在取一行中的数据时,找到第一个和最后一个selected的值,然后
             * 不管selected是真是假中间的值全部保留
             */
            let result = [];
            this.tableJson.rows.forEach(row => {
                // const colList = row.cols.filter(col => {
                //     return col.selected == true;
                // });
                // const lastIndex = row.cols.lastIndexOf(col => {
                //     return col.selected == true;
                // });
                const index = row.cols.findIndex(col => {
                    return col.selected == true;
                });
                const lastIndex = _.findLastIndex(row.cols, col => {
                    return col.selected == true;
                });
                let colList = [];
                if(lastIndex != -1) { // 只需要判断一个就行
                    for(let i = index; i <= lastIndex; i++) {
                        colList.push(row.cols[i]);
                    }
                }
                if(colList.length) {
                    result.push(colList);
                }
            });
            return result;
        },
        mergeCol() {
            if(!this.canMerge()) {
                console.log('不能合并')
                return;
            }
            /**
             * 根据当前选中的单元格selected为true,进行合并操作,每次合并完后,需要将所有的
             * selected置为false
             * 取第一个selected对象,需要根据后面的遍历结果对这个对象进行rowspan,colspan的
             * 设置.其他对象设置hidden为true,因为其他对象被合并后是不能显示的
             */
            const selectedList = this.getSelectedData();
            console.log('selectedList', selectedList);
            //return;
            selectedList.forEach(cols => {
                cols.forEach(col => {
                    col.hidden = true;
                    col.selected = false; //顺带就把标志置为false
                });
            });
            let firstCol = selectedList[0][0];
            firstCol.hidden = false;
            firstCol.colspan = selectedList[0].length;
            firstCol.rowspan = selectedList.length;
            //return this.tableJson.rows[index];
        },
        canMerge() {
            /**
             * 1.得到selectedList,二维数组
             * 2.遍历selectedList,只需要判断每一行的个数是否相等即可
             */
            const selectedList = this.getSelectedData();
            // 1.如果selectedList为空,则不能合并
            if(!selectedList.length) {
                return false;
            }
            // 2.判断选中的是否只是一个单元格,如果是,则不能合并
            if(this.isOneCol(selectedList)) {
                return false;
            }
            // 3.如果每行个数不一致则不能合并
            const rowLength = selectedList[0].length;
            for(let i = 1, j = selectedList.length; i < j; i++) {
                if(selectedList[i].length !== rowLength) {
                    return false;
                }
            }
            return true;
        },
        isOneCol(selectedList) {
            /**
             * 判断col的hidden不为false的个数,如果大于1则不是一个单元格
             */
            let total = 0; // 这里不用for循环进一步提升性能了,感觉提升有限
            selectedList.forEach(cols => {
                cols.forEach(col => {
                    if(!col.hidden) {
                        total++;
                    }
                });
            });
            return total == 1;
        },
        splitCol() {
            if(!this.canSplit()) {
                console.log('不能拆分')
                return;
            }
            /**
             * 取出每一个col,
             * 将hidden设为false,
             * 将colspan设为1,
             * 将rowspan设为1
             */
            const selectedList = this.getSelectedData();
            selectedList.forEach(cols => {
                cols.forEach(col => {
                    col.hidden = false;
                    col.rowspan = 1;
                    col.colspan = 1;
                    col.selected = false; //顺带就把标志置为false
                });
            });
        },
        canSplit() {
            /**
             * 1.为空不能
             * 2.如果看上去不是一个单元格不能
             * 3.如果只是一个基础单元格不能
             */
            const selectedList = this.getSelectedData();
            // 1.如果selectedList为空,则不能合并
            if(!selectedList.length) {
                return false;
            }
            // 2.判断选中的是否只是一个单元格,如果是,则不能合并
            if(!this.isOneCol(selectedList)) {
                return false;
            }
            let firstCol = selectedList[0][0];
            let firstTotal = firstCol.rowspan - 0 + (firstCol.colspan - 0);
            return firstTotal != 2;
        },
        getTdClass(col) {
            let result = [];
            if(col.selected) {
                result.push('selected');
            }
            return result;
        },
        getClass() {
            let result = [];
            if(this.canMerge()) {
                result.push('can');
            }
            return result;
        },
        getSplitClass() {
            let result = [];
            if(this.canSplit()) {
                result.push('can');
            }
            return result;
        },
    },
};
</script>
<style lang="less">
body{
    background: #abc;
}
table{
    width: 100%;
    td{
        height: 40px;
        min-width: 40px;
        border: 1px solid yellow;
    }
}

.btn{
    cursor: pointer;
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: #666;
}
.can{
    background: skyblue;
}
.selected{
    background: #fff12f;
}
</style>
