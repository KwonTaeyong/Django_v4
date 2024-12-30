const Grid = tui.Grid
Grid.setLanguage('ko')
Grid.applyTheme('default', {
    area: {
        header: '#555',
        border: '#111',
    },
    cell: {
        normal: {
            background: '#ffffff',
            border: '#d0d9db',
            showVerticalBorder: true,
            showHorizontalBorder: true
        },
        header: {
            background: '#f2f0ed',
            border: 'transparent',
        },
        rowHeader: {
            showVerticalBorder: false,
            border: '#d0d9db',
        },
        focused: {
            border: 'gray'
        }
    },
});

//커스텀헤더 에디트
class EditHeader {
    constructor(props) {
        const columnInfo = props.columnInfo
        const el = document.createElement('div');
        el.className = 'custom_header_edit';
        el.textContent = `${columnInfo.header}`;
        this.el = el;
    }

    getElement() {
        return this.el;
    }

    render(props) {
        this.el.textContent = `${props.columnInfo.header}`;
    }
}

function setgrid(grid, chk) {
    // 그리드 리프레쉬
    $(".grid_refresh").on("click", function () {
        grid.refreshLayout()
    })
}

function dataSource(url, method, params) {
    return {
        contentType: 'application/json',
        api: {
            readData: {
                url: "/ext/e_gridapi/",
                method: 'GET',
                initParams: params
            }
        },
        initialRequest: false
    }
}

class setTitleAnchor {
    constructor(props) {
        this.el = document.createElement('a');
        this.el.setAttribute("href", "javascript:inqDetail(" + props.rowKey + ")")
        this.el.textContent = props.value;
    }

    getElement() {
        return this.el;
    }

    render(props) {

    }
}

function gridform_allNoti(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        bodyHeight: 500,
        rowHeaders: ['rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '구매번호',
                name: 'ODBID_ID',
                hidden: true
            },
            {
                header: '견적구분',
                name: 'NOTI_TP',
                formatter(props) {
                    if (props.value === '001') {
                        return "공개견적";
                    }
                },
                align: "center",
                width: 100,
            },
            {
                header: '품목 분류',
                name: '',
                width: 100,
            },
            {
                header: '견적요청명/공고명',
                name: 'NOTI_NM',
                renderer: setTitleAnchor,
                width: 300,
                minWidth: 200,
            },
            {
                header: '수요업체명',
                name: 'COM_NM',
                align: "center",
                width: 200,
            },
            {
                header: '공고일',
                name: 'REG_DATE',
                align: "center",
                width: 200,
            },
            {
                header: '견적 마감일',
                name: 'NOTI_DD',
                align: "center",
                width: 200,
            },
        ],
        columnOptions: {
            resizable: true
        }
    });
}

function gridform_favorNoti(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        bodyHeight: 500,
        rowHeaders: ['checkbox', 'rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '구매번호',
                name: 'ODBID_ID',
                hidden: true
            },
            {
                header: '견적구분',
                name: 'NOTI_TP',
                formatter(props) {
                    if (props.value === '001') {
                        return "공개견적";
                    }
                },
                align: "center",
                width: 100,
            },
            {
                header: '품목 분류',
                name: '',
                width: 100,
            },
            {
                header: '견적요청명/공고명',
                name: 'NOTI_NM',
                renderer: setTitleAnchor,
                width: 300,
                minWidth: 200,
            },
            {
                header: '수요업체명',
                name: 'COM_NM',
                align: "center",
                width: 200,
            },
            {
                header: '공고일',
                name: 'REG_DATE',
                align: "center",
                width: 200,
            },
            {
                header: '견적 마감일',
                name: 'NOTI_DD',
                align: "center",
                width: 200,
            },
        ],
        columnOptions: {
            resizable: true
        }
    });
}

function gridform_notidetail(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
            columns: [
                {
                    name: 'OFFER_AMU',
                    renderer: EditHeader,
                },
            ],
        },
        rowHeaders: ['rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '품목명',
                name: 'ITEM_NM',
                width: 200,
                minWidth: 200,
            },
            {
                header: '규격',
                name: 'ITEM_STND',
                align: "center",
                width: 150,
                minWidth: 150,
            },
            {
                header: '단위',
                name: 'ITEM_UNIT',
                align: "right",
                width: 80,
                minWidth: 80,
            },
            {
                header: '비고',
                name: 'RMK'
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                align: "right",
                width: 100,
                minWidth: 100,
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '공급 단가',
                name: 'OFFER_AMU',
                validation: {required: true},
                editor: 'text',
                align: "right",
                width: 150,
                minWidth: 150,
                formatter(props) {
                    let value = Number(props.value)
                    if (!value) {
                        return 0
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                onBeforeChange: function (ev) {
                    if (!/^\d+$/.test(ev.nextValue) && ev.nextValue || ev.nextValue < 0) {
                        ev.stop();
                        alert("자연수만 입력 가능합니다.")
                    }
                },
                onAfterChange: function (ev) {
                    let ITEM_QT = grid_notidetail.getValue(ev.rowKey, "ITEM_QT")
                    let OFFER_AM = ITEM_QT * ev.value
                    grid_notidetail.setValue(ev.rowKey, "OFFER_AM", OFFER_AM)
                },
            },
            {
                header: '공급 금액',
                name: 'OFFER_AM',
                align: "right",
                width: 200,
                minWidth: 200,
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
        ],
        summary: {
            height: 50,
            position: 'bottom',
            columnContent: {
                OFFER_AMU: {
                    template() {
                        return "총 금액 : ";
                    }
                },
                OFFER_AM: {
                    template: function (valueMap) {
                        return `${valueMap.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                    },
                    align: "right",
                },
            }
        },
        columnOptions: {
            resizable: true
        }
    });
}

function gridform_offer(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        bodyHeight: 500,
        rowHeaders: ['checkbox', 'rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '구매번호',
                name: 'ODBID_ID',
                hidden: true
            },
            {
                header: '견적 상태',
                name: 'OFFER_STA',
                align: "center",
                width: 80,
            },
            {
                header: '견적구분',
                name: 'NOTI_TP',
                formatter(props) {
                    if (props.value === '001') {
                        return "공개견적";
                    }
                },
                align: "center",
                width: 100,
            },
            {
                header: '품목 분류',
                name: '',
                width: 100,
            },
            {
                header: '견적요청명/공고명',
                name: 'NOTI_NM',
                renderer: setTitleAnchor,
                width: 300,
                minWidth: 200,
            },
            {
                header: '수요업체명',
                name: 'COM_NM',
                align: "center",
                width: 200,
            },
            {
                header: '견적일시',
                name: 'OFFER_DTS',
                align: "center",
                width: 150,
            },
            {
                header: '확인일시',
                name: 'CHK_DTS',
                align: "center",
                width: 150,
            },
            {
                header: '공고일',
                name: 'REG_DATE',
                align: "center",
                width: 150,
            },
            {
                header: '견적 마감일',
                name: 'NOTI_DD',
                align: "center",
                width: 150,
            },
        ],
        columnOptions: {
            resizable: true
        }
    });
}

function gridform_accoffer(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        bodyHeight: 500,
        rowHeaders: ['checkbox', 'rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '구매번호',
                name: 'ODBID_ID',
                hidden: true
            },
            {
                header: '견적 상태',
                name: 'OFFER_STA',
                align: "center",
                width: 80,
            },
            {
                header: '견적구분',
                name: 'NOTI_TP',
                formatter(props) {
                    if (props.value === '001') {
                        return "공개견적";
                    }
                },
                align: "center",
                width: 100,
            },
            {
                header: '품목 분류',
                name: '',
                width: 100,
            },
            {
                header: '견적요청명/공고명',
                name: 'NOTI_NM',
                renderer: setTitleAnchor,
                width: 300,
                minWidth: 200,
            },
            {
                header: '수요업체명',
                name: 'COM_NM',
                align: "center",
                width: 200,
            },
            {
                header: '견적일시',
                name: 'OFFER_DTS',
                align: "center",
                width: 150,
            },
            {
                header: '공고일',
                name: 'REG_DATE',
                align: "center",
                width: 150,
            },
            {
                header: '견적 마감일',
                name: 'NOTI_DD',
                align: "center",
                width: 150,
            },
        ],
        columnOptions: {
            resizable: true
        }
    });
}


function gridform_offerdetail(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
            columns: [
                {
                    name: 'OFFER_AMU',
                    renderer: EditHeader,
                },
            ],
        },
        rowHeaders: ['rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '품목명',
                name: 'ITEM_NM',
                width: 200,
                minWidth: 200,
            },
            {
                header: '규격',
                name: 'ITEM_STND',
                align: "center",
                width: 150,
                minWidth: 150,
            },
            {
                header: '단위',
                name: 'ITEM_UNIT',
                align: "right",
                width: 80,
                minWidth: 80,
            },
            {
                header: '비고',
                name: 'RMK'
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                align: "right",
                width: 100,
                minWidth: 100,
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '공급 단가',
                name: 'OFFER_AMU',
                validation: {required: true},
                editor: 'text',
                align: "right",
                width: 150,
                minWidth: 150,
                formatter(props) {
                    let value = Number(props.value)
                    if (!value) {
                        return 0
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                onBeforeChange: function (ev) {
                    if (!/^\d+$/.test(ev.nextValue) && ev.nextValue || ev.nextValue < 0) {
                        ev.stop();
                        alert("자연수만 입력 가능합니다.")
                    }
                },
                onAfterChange: function (ev) {
                    let ITEM_QT = grid_offerdetail.getValue(ev.rowKey, "ITEM_QT")
                    let OFFER_AM = ITEM_QT * ev.value
                    grid_offerdetail.setValue(ev.rowKey, "OFFER_AM", OFFER_AM)
                },
            },
            {
                header: '공급 금액',
                name: 'OFFER_AM',
                align: "right",
                width: 200,
                minWidth: 200,
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
        ],
        summary: {
            height: 50,
            position: 'bottom',
            columnContent: {
                OFFER_AMU: {
                    template() {
                        return "총 금액 : ";
                    }
                },
                OFFER_AM: {
                    template: function (valueMap) {
                        return `${valueMap.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                    },
                    align: "right",
                },
            }
        },
        columnOptions: {
            resizable: true
        }
    });
}

// 진행중 계약
function gridform_ingcont(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 400,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '계약구분',
                name: 'CONT_STA',
                sortable: 'true',
                align: "center",
                width: 100,
                minWidth: 100,
            },
            {
                header: '계약 번호',
                name: 'CONT_ID',
                sortable: 'true',
                align: "center",
                width: 150,
                minWidth: 150,
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '계약명',
                name: 'CONT_NM',
                sortable: 'true',
                width: 250,
                minWidth: 250,
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true},
                renderer: setTitleAnchor,
            },
            {
                header: '수요 업체명',
                name: 'ICOM_NM',
                sortable: 'true',
                width: 200,
                minWidth: 200,
            },
            {
                header: '견적 승인일',
                name: 'ACC_DT',
                sortable: 'true',
                align: "center",
                width: 120,
                minWidth: 120,
            },
            {
                header: '계약 작성일',
                name: 'CONT_DT',
                sortable: 'true',
                align: "center",
                width: 120,
                minWidth: 120,
            },
        ],
    });
}

// 완료된 계약
function gridform_confcont(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 400,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '계약구분',
                name: 'CONT_STA',
                sortable: 'true',
                align: "center",
                width: 100,
                minWidth: 100,
            },
            {
                header: '계약 번호',
                name: 'CONT_ID',
                sortable: 'true',
                align: "center",
                width: 150,
                minWidth: 150,
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '계약명',
                name: 'CONT_NM',
                sortable: 'true',
                width: 250,
                minWidth: 250,
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true},
                renderer: setTitleAnchor,
            },
            {
                header: '수요 업체명',
                name: 'ICOM_NM',
                sortable: 'true',
                width: 200,
                minWidth: 200,
            },
            {
                header: '계약 상대자 결정일',
                name: 'ACC_DT',
                sortable: 'true',
                align: "center",
                width: 150,
                minWidth: 150,
            },
            {
                header: '계약 작성일',
                name: 'CONT_DT',
                sortable: 'true',
                align: "center",
                width: 120,
                minWidth: 120,
            },
            {
                header: '계약 확정일',
                name: 'CONF_DT',
                sortable: 'true',
                align: "center",
                width: 120,
                minWidth: 120,
            },
            {
                header: '계약 등록자',
                name: 'REG_USER',
                sortable: 'true',
                width: 150,
                minWidth: 150,
            },
        ],
    });
}

function gridform_contdetail(table) {
    return new Grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
            columns: [
                {
                    name: 'OFFER_AMU',
                    renderer: EditHeader,
                },
            ],
        },
        rowHeaders: ['rowNum'],
        rowHeight: 30,
        columns: [
            {
                header: '품목명',
                name: 'ITEM_NM',
                width: 200,
                minWidth: 200,
            },
            {
                header: '규격',
                name: 'ITEM_STND',
                align: "center",
                width: 150,
                minWidth: 150,
            },
            {
                header: '단위',
                name: 'ITEM_UNIT',
                align: "right",
                width: 80,
                minWidth: 80,
            },
            {
                header: '비고',
                name: 'RMK'
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                align: "right",
                width: 100,
                minWidth: 100,
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '공급 단가',
                name: 'OFFER_AMU',
                align: "right",
                width: 150,
                minWidth: 150,
                formatter(props) {
                    let value = Number(props.value)
                    if (!value) {
                        return 0
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '공급 금액',
                name: 'OFFER_AM',
                align: "right",
                width: 200,
                minWidth: 200,
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
        ],
        summary: {
            height: 50,
            position: 'bottom',
            columnContent: {
                OFFER_AMU: {
                    template() {
                        return "총 금액 : ";
                    }
                },
                OFFER_AM: {
                    template: function (valueMap) {
                        return `${valueMap.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                    },
                    align: "right",
                },
            }
        },
        columnOptions: {
            resizable: true
        }
    });
}