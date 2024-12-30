//그리드 테마
const grid = tui.Grid
grid.setLanguage('ko')
grid.applyTheme('default', {
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
            background: '#dde6ed',
            border: 'transparent',
        },
        rowHeader: {
            showVerticalBorder: false,
            border: '#d0d9db',
        },
        editable: {
            background: 'rgba(0,0,0,0.02)',
            text: '#000000',
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


function setgrid(grid, chk1, chk2) {
    if (chk1) {
        grid.on('click', ev => {
            if (ev.targetType !== "cell") {
                return false;
            }
            var rowData = grid.getRow(ev.rowKey)
            if (rowData._attributes.checked) {
                grid.uncheck(ev.rowKey)
            } else {
                grid.check(ev.rowKey)
            }
        })
    } else {
        grid.on('focusChange', ev => {
            grid.removeRowClassName(ev.prevRowKey, "grid_focus_row")
            grid.addRowClassName(ev.rowKey, "grid_focus_row")
        });
    }
    // request 전 로딩 show, response 후 로딩 hide
    if (!chk2) {
        grid.on('beforeRequest', function () {
            $(".loading").show()
        });
        grid.on('response', function () {
            setTimeout(function () {
                $(".loading").hide()
            }, 200)
        })
    }
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
                url: "gridapi/",
                method: 'GET',
                initParams: params
            }
        },
        initialRequest: false
    }
}

//구매 요청 등록 - 품목 추가
function gridform_getitem(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        bodyHeight: 600,
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '품목ID',
                name: 'ITEM_ID',
                hidden: true
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                sortable: 'true',
                validation: {required: true},
                minWidth: 100,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '품목코드',
                name: 'ITEM_CD',
                sortable: 'true',
                minWidth: 100,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '규격',
                name: 'ITEM_STND',
                sortable: 'true',
                minWidth: 90,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '품목군',
                name: 'ITEM_GRP',
                sortable: 'true',
                minWidth: 90,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '단위',
                name: 'ITEM_UNIT',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                align: "center",
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '브랜드',
                name: 'ITEM_BRAND',
                sortable: 'true',
                minWidth: 90,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: 'HS코드',
                name: 'HSCODE',
                sortable: 'true',
                minWidth: 90,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '바코드',
                name: 'BARCODE',
                sortable: 'true',
                minWidth: 90,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '비고',
                name: 'RMK',
                sortable: 'true',
                minWidth: 200,
                width: 200,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '사용여부',
                name: 'USE_YN',
                sortable: 'true',
                minWidth: 80,
                width: 80,
                align: "center"
            },
            {
                header: '구매요청수량',
                name: 'OD_QT',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                align: 'right',
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '등록자',
                name: 'REG_USER',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true},
                align: 'center'
            },
            {
                header: '등록일',
                name: 'REG_DATE',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                filter: {
                    type: 'date',
                    showApplyBtn: true,
                    showClearBtn: true,
                    options: {
                        format: 'yyyy-MM-dd',
                        language: "ko",
                        selectableRanges: [[new Date(2023, 1, 1), new Date()]],
                    },
                },
                align: 'center'
            },
        ],
    });
}

//구매 요청 등록
function gridform_odreq_reg(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        minBodyHeight: 400,
        header: {
            height: 30,
            columns: [
                {
                    name: 'ITEM_QT',
                    renderer: EditHeader,
                },
                {
                    name: 'REQDUE_DT',
                    renderer: EditHeader,
                },
                {
                    name: 'RMK',
                    renderer: EditHeader,
                }
            ],
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '품목ID',
                name: 'ITEM_ID',
                minWidth: 100,
                hidden: true,
            },
            {
                header: '품목군',
                name: 'ITEM_GRP',
                minWidth: 200,
            },
            {
                header: '품목코드',
                name: 'ITEM_CD',
                minWidth: 100,
                sortable: 'true',
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                minWidth: 200,
                sortable: 'true',
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                validation: {required: true},
                editor: 'text',
                onBeforeChange: function (ev) {
                    if (!/^\d+$/.test(ev.nextValue) && ev.nextValue || ev.nextValue < 1) {
                        ev.stop();
                        alert("자연수만 입력 가능합니다.")
                    }
                },
                minWidth: 100,
                width: 100,
                align: "right",
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '희망납기일',
                name: 'REQDUE_DT',
                editor: {
                    type: 'datePicker',
                    options: {
                        format: 'yyyy-MM-dd',
                        language: "ko",
                        selectableRanges: [[new Date(), new Date(9999, 11, 31)]],
                    },
                },
                onBeforeChange: function (ev) {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.nextValue) && ev.nextValue) {
                        ev.stop();
                        alert("날짜형식만 입력 가능합니다.")
                    }
                },
                minWidth: 110,
                width: 110,
                align: "center",
            },
            {
                header: '비고',
                name: 'RMK',
                editor: 'text',
                minWidth: 400,
                sortable: 'true',
            },
        ],
    });
}

//구매 요청 목록
function gridform_12(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 600,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '요청번호',
                name: 'ODREQ_ID',
                minWidth: 100,
                align: "center",
                hidden: "true"
            },
            {
                header: '요청상태',
                name: 'ODREQ_STA',
                minWidth: 100,
                align: "center",
                sortable: 'true',
                filter: 'select',
                formatter(props) {
                    if (props.value === '001') {
                        return "접수";
                    }
                    if (props.value === '002') {
                        return "승인";
                    }
                    if (props.value === '003') {
                        return "반려";
                    }
                }
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                minWidth: 150,
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                minWidth: 90,
                align: "right",
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true',
            },
            {
                header: '희망납기일',
                name: 'REQDUE_DT',
                minWidth: 110,
                align: "center",
                sortable: 'true',
                filter: {type: 'date', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '요청자',
                name: 'REG_USER',
                minWidth: 100,
                align: "center",
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '요청일',
                name: 'REG_DATE',
                minWidth: 110,
                align: "center",
                sortable: 'true',
                filter: {type: 'date', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '비고',
                name: 'RMK1',
                minWidth: 300,
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '반려사유',
                name: 'RETU_INFO',
                minWidth: 300,
                hidden: "true",
                sortable: 'true',
                filter: 'select'
            },
        ],
    });
}

//구매 공고 등록 - 구매 품목 선택
function gridform_getacreq(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 900,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '요청번호',
                name: 'ODREQ_ID',
                minWidth: 100,
                align: "center",
                hidden: "true"
            },
            {
                header: '품목ID',
                name: 'ITEM_ID',
                minWidth: 150,
                hidden: "true"
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                minWidth: 150,
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                minWidth: 100,
                align: "right",
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true',
            },
            {
                header: '희망납기일',
                name: 'REQDUE_DT',
                minWidth: 110,
                align: "center",
                sortable: 'true',
                filter: {type: 'date', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '요청자',
                name: 'REG_USER',
                minWidth: 100,
                align: "center",
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '요청일',
                name: 'REG_DATE',
                minWidth: 110,
                align: "center",
                sortable: 'true',
                filter: {type: 'date', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '비고',
                name: 'RMK',
                minWidth: 300,
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
        ]
    });
}

//구매 공고 등록 - 목록
function gridform_13(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '요청 번호',
                name: 'ODREQ_ID',
                hidden: "true"
            },
            {
                header: '품목ID',
                name: 'ITEM_ID',
                hidden: "true",
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                align: "right",
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true'
            },
            {
                header: '비고',
                name: 'RMK',
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '직전 단가',
                name: '',
                align: "right",
                formatter(props) {
                    // let value = Number(props.value)
                    let value = 1000
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true',
                filter: {type: 'number', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '최저 단가',
                name: '',
                align: "right",
                formatter(props) {
                    // let value = Number(props.value)
                    let value = 1000
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true',
                filter: {type: 'number', showApplyBtn: true, showClearBtn: true}
            },
        ],
    });
}

//구매 등록 현황
function gridform_141(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 400,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '구매 구분',
                name: 'NOTI_TP',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                formatter(props) {
                    if (props.value === '001') {
                        return "공개견적";
                    }
                },
                align: "center"
            },
            {
                header: '구매 번호',
                name: 'ODBID_ID',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center"
            },
            {
                header: '견적 요청명',
                name: 'NOTI_NM',
                sortable: 'true',
                minWidth: 100,
            },
            {
                header: '견적 등록자',
                name: 'REG_USER',
                sortable: 'true',
                minWidth: 100,
                align: "center",
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '견적 등록일',
                name: 'REG_DATE',
                sortable: 'true',
                minWidth: 110,
                align: "center",
            },
            {
                header: '견적 마감일',
                name: 'NOTI_DD',
                sortable: 'true',
                minWidth: 110,
                align: "center",
                filter: {type: 'date', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '견적 요청 상세',
                name: 'NOTI_INFO',
                hidden: true
            },
            {
                header: '첨부파일',
                name: 'ATT',
                hidden: true
            },
        ],
    });
}

function gridform_odbiddtl(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '요청번호',
                name: 'ODREQ_ID',
                hidden: "true"
            },
            {
                header: '품목ID',
                name: 'ITEM_ID',
                hidden: "true",
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '품목코드',
                name: 'ITEM_CD',
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '수량',
                name: 'ITEM_QT',
                align: "right",
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true'
            },
            {
                header: '비고',
                name: 'RMK',
                sortable: 'true',
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '직전 단가',
                name: '',
                align: "right",
                formatter(props) {
                    // let value = Number(props.value)
                    let value = 1000
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true',
                filter: {type: 'number', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '최저 단가',
                name: '',
                align: "right",
                formatter(props) {
                    // let value = Number(props.value)
                    let value = 1000
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
                sortable: 'true',
                filter: {type: 'number', showApplyBtn: true, showClearBtn: true}
            },
        ],
    });
}

function gridform_offernoti(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 200,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '구매번호',
                name: 'ODBID_ID',
                sortable: 'true',
                align: "center",
                width: 150,
            },
            {
                header: '견적 구분',
                name: 'NOTI_TP',
                sortable: 'true',
                width: 100,
                minWidth: 100,
                align: "center",
            },
            {
                header: '견적 요청명',
                name: 'NOTI_NM',
                sortable: 'true',
                width: 300,
                minWidth: 300,
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '받은 견적수',
                name: 'OFFER_CNT',
                sortable: 'true',
                width: 100,
                minWidth: 100,
                align: "center",
                formatter(props) {
                    return props.value + ' 건';
                },
            },
            {
                header: '등록일',
                name: 'REG_DATE',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },
            {
                header: '견적 마감일',
                name: 'NOTI_DD',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },
            {
                header: '등록자',
                name: 'REG_USER',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },

        ],
    });
}

function gridform_offer(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 400,
        header: {
            height: 30,
        },
        rowHeight: 30,
        rowHeaders: ['rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '구매번호',
                name: 'ODBID_ID',
                hidden: true
            },
            {
                header: '견적 업체명',
                name: 'COM_NM',
                align: "center",
                width: 200,
            },
            {
                header: '견적 등록 일시',
                name: 'OFFER_DTS',
                align: "center",
                width: 150,
            },
            {
                header: '견적 확인 일시',
                name: 'CHK_DTS',
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
    return new grid({
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
                header: '구매 번호',
                name: 'ODBID_ID',
                sortable: 'true',
                width: 100,
                minWidth: 100,
                align: "center",
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true},
                hidden: true
            },
            {
                header: '견적 구분',
                name: 'NOTI_TP',
                sortable: 'true',
                width: 100,
                minWidth: 100,
                align: "center",
            },
            {
                header: '견적 요청명',
                name: 'NOTI_NM',
                sortable: 'true',
                width: 300,
                minWidth: 300,
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '등록일',
                name: 'REG_DATE',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },
            {
                header: '등록자',
                name: 'REG_USER',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },
            {
                header: '견적 업체명',
                name: 'COM_NM',
                sortable: 'true',
                width: 150,
                minWidth: 150,
            },
            {
                header: '견적 등록일',
                name: 'OFFER_DTS',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },
            {
                header: '계약상대자 결정일',
                name: 'ACC_DTS',
                sortable: 'true',
                width: 150,
                minWidth: 150,
                align: "center",
            },
        ],
    });
}

function gridform_offerdtl(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        header: {
            height: 30,
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
                }
            },
            {
                header: '공급 금액',
                name: 'OFFER_AM',
                align: "right",
                width: 150,
                minWidth: 150,
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
    return new grid({
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
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '공급 업체명',
                name: 'ECOM_NM',
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
                header: '계약 등록자',
                name: 'REG_USER',
                sortable: 'true',
                width: 150,
                minWidth: 150,
            },
        ],
    });
}

// 완료된 계약
function gridform_confcont(table) {
    return new grid({
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
                filter: {type: 'text', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '공급 업체명',
                name: 'ECOM_NM',
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

//품목 관리
function gridform_itemlist(table) {
    return new grid({
        el: document.getElementById(table),
        data: dataSource(),
        scrollX: true,
        scrollY: true,
        bodyHeight: 600,
        header: {
            height: 30,
        },
        columnOptions: {
            resizable: true,
        },
        rowHeight: 30,
        rowHeaders: ['checkbox', 'rowNum'],
        selectionUnit: 'row',
        columns: [
            {
                header: '품목ID',
                name: 'ITEM_ID',
                minWidth: 200,
                width: 200,
                hidden: true,
            },
            {
                header: '품목명',
                name: 'ITEM_NM',
                sortable: 'true',
                editor: 'text',
                validation: {required: true},
                minWidth: 200,
                width: 200,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '품목코드',
                name: 'ITEM_CD',
                sortable: 'true',
                editor: 'text',
                minWidth: 150,
                width: 150,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '규격',
                name: 'ITEM_STND',
                sortable: 'true',
                editor: 'text',
                minWidth: 200,
                width: 200,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '품목군',
                name: 'ITEM_GRP',
                sortable: 'true',
                minWidth: 200,
                width: 200,
                editor: 'text',
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true},
            },
            {
                header: '단위',
                name: 'ITEM_UNIT',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                align: "center",
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true},
                editor: {
                    type: 'select',
                    options: {
                        listItems: [
                            {text: 'EA', value: 'EA'},
                            {text: 'kg', value: 'kg'},
                            {text: 'g', value: 'g'},
                            {text: 'mg', value: 'mg'},
                            {text: 'lb', value: 'lb'},
                            {text: 'oz', value: 'oz'},
                            {text: 'm', value: 'm'},
                            {text: 'cm', value: 'cm'},
                            {text: 'km', value: 'km'},
                            {text: 'mile', value: 'mile'},
                            {text: 'inch', value: 'inch'},
                            {text: 'feet', value: 'feet'},
                            {text: 'yard', value: 'yard'},
                            {text: 'L', value: 'L'},
                            {text: 'mL', value: 'mL'},
                            {text: 'gallon', value: 'gallon'},
                        ]
                    }
                },
            },
            {
                header: '브랜드',
                name: 'ITEM_BRAND',
                sortable: 'true',
                editor: 'text',
                minWidth: 200,
                width: 200,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: 'HS코드',
                name: 'HSCODE',
                sortable: 'true',
                editor: 'text',
                minWidth: 150,
                width: 150,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '바코드',
                name: 'BARCODE',
                sortable: 'true',
                editor: 'text',
                minWidth: 150,
                width: 150,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '비고',
                name: 'RMK',
                sortable: 'true',
                editor: 'text',
                minWidth: 200,
                width: 200,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true}
            },
            {
                header: '사용여부',
                name: 'USE_YN',
                sortable: 'true',
                minWidth: 80,
                width: 80,
                editor: {
                    type: 'select',
                    options: {
                        listItems: [
                            {text: 'Y', value: 'Y'},
                            {text: 'N', value: 'N'}
                        ]
                    }
                },
                align: "center"
            },
            {
                header: '구매등록 수량',
                name: 'OD_QT',
                sortable: 'true',
                minWidth: 120,
                width: 120,
                align: 'right',
                formatter(props) {
                    let value = Number(props.value)
                    if (value === 0) {
                        return ''
                    }
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            },
            {
                header: '등록자',
                name: 'REG_USER',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                filter: {type: 'select', showApplyBtn: true, showClearBtn: true},
                align: 'center'
            },
            {
                header: '등록일',
                name: 'REG_DATE',
                sortable: 'true',
                minWidth: 100,
                width: 100,
                filter: {
                    type: 'date',
                    showApplyBtn: true,
                    showClearBtn: true,
                    options: {
                        format: 'yyyy-MM-dd',
                        language: "ko",
                        selectableRanges: [[new Date(2023, 1, 1), new Date()]],
                    },
                },
                align: 'center'
            },
        ],
    });
}