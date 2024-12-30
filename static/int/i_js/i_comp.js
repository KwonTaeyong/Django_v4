//// 확인 누르면 메시지박스 종료(컨펌은 취소)
$(".msgbox_close").on("click", function (_this) {
    mpop.close(_this.currentTarget)
})

//// 키이벤트 (esc, enter)
window.addEventListener("keyup", e => {
    $(".msgbox_close").each((i, el) => {
        let pop_bg = $(el).parents(".pop_bg");
        if (pop_bg.css("display") === "flex") {
            if (e.key === "Escape") {
                mpop.close(el);
            } else if (e.key === "Enter") {
                if (pop_bg.hasClass("confirmbg")){
                    $("#confirm_ok").click();
                } else {
                    mpop.close(el);
                }
            }
        }
    });
});

var mpop = {
    timer: 100, // 팝업속도
    msgbox: function (txt) {
        this.open("#msg_body", txt)
    },
    error: function (txt) {
        this.open("#error_body", txt)
    },
    success: function (txt) {
        this.open("#success_body", txt)
    },
    confirm: function (txt, callback) {
        if (callback == null || typeof callback != 'function') {
            return false;
        } else {
            $("#confirm_ok").on("click", function () {
                callback(true);
                mpop.close(this)
            })
            this.open("#confirm_body", txt)
        }
    },
    //// 모달 열기 공통
    open: function (_this, txt) {
        let $body = $(_this)
        let $box = $body.closest(".pop_box")
        let $bg = $box.closest(".pop_bg")
        $body.html(txt)
        $bg.css("display", "flex")
        setTimeout(function () {
            $box.css("transform", "scale(1,1)").css("opacity", "1")
        }, this.timer)
    },
    //// 모달 닫기 공통
    close: function (_this) {
        $("#confirm_ok").unbind("click")
        let $box = $(_this).closest(".pop_box")
        let $bg = $box.closest(".pop_bg")
        $box.css("transform", "scale(0,0)").css("opacity", "0")
        setTimeout(function () {
            $bg.css("display", "none")
        }, this.timer)
    }
};