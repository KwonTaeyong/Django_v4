/* 탭 활성화 */
$(document).on("click", ".main_tab", function (event) {
    event.stopPropagation()

    let _tab = $(this)
    let other_tab = _tab.siblings()
    other_tab.removeClass("active")
    _tab.addClass("active")

    let tab_id = this.id
    $(".main_con > div").hide()
    $(".main_con > #" + tab_id).show()
    $(".grid_refresh").click()
})

/* 탭 닫기 */
$(document).on("click", ".tab_cls_btn", function (event) {
    event.stopPropagation()

    let _tab = $(this).parents("li")
    let _tab_name = _tab.attr("title")
    mpop.confirm("\"" + _tab_name + "\"" + " 탭을 종료하시겠습니까?", function () {
        /* 다음 액티브 할 탭 선택*/
        if (!_tab.siblings().hasClass("active")) {
            if (_tab.next().length) {
                _tab.next().click()
            } else {
                _tab.prev().click()
            }
        }
        /* 탭 삭제 */
        _tab.remove()
        let tab_id = _tab.attr("id")
        $(".main_con > #" + tab_id).remove()
    })
})

/* 모든 탭 닫기 */
$(".tab_all_cls_btn").on("click", function () {
    let _allTabs = $(".main_tabs > #tab_index").nextAll()
    let _allCons = $(".main_con > #tab_index").nextAll()
    if (!_allTabs.length) {
        return false;
    }
    mpop.confirm("모든 탭을 종료 하시겠습니까?", function () {
        _allTabs.remove()
        _allCons.remove()
        $(".main_tabs > #tab_index").click()
    })
})

/* 탭 생성 */
$('nav .sub_menu > li').click(function () {
    let $this = $(this)
    $this.children("a").blur()
    let menu_id = this.id
    let menu_name = this.querySelector('a').textContent
    let isinTab = $(".main_tabs > #" + menu_id)
    /* 탭 열려 있는 지 확인 */
    if (isinTab.length) {
        isinTab.click()
        return false;
    }
    /* 탭 12개 초과하면 탭 닫기 */
    let _allTabs = $(".main_tabs > #tab_index").nextAll()
    let _allCons = $(".main_con > #tab_index").nextAll()
    if (_allTabs.length > 8) {
        let _tab_name = _allTabs[0].title
        mpop.confirm("\"" + _tab_name + "\"" + " 탭을 닫고 새로운 탭을 여시겠습니까?", function () {
            _allTabs[0].remove()
            _allCons[0].remove()
            add_tab()
        })
    } else {
        add_tab()
    }

    /* 탭 추가 */
    function add_tab() {
        let new_tab = $("#new_tab").clone()
        new_tab.prop("id", menu_id)
        new_tab.prop("title", menu_name)
        new_tab.find("a > span:eq(0)").text(menu_name)
        new_tab.show()
        $(".main_tabs").append(new_tab)
        new_tab.click()

        /* 탭 콘텐츠 불러오기 */
        const con_url = $this.data('link')
        $.ajax({
            url: con_url,
            success: function (result) {
                $(".main_con").append(result)
                $(".main_con #" + menu_id + " > .con_title > h3").text(menu_name)
            }
        });
    }
})