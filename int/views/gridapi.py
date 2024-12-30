from django.http import JsonResponse
from . import quex
from datetime import datetime

def data(request):
    com_id = request.user.last_name
    req = request.GET
    contents = []

    ### 구매 요청
    if req.get("action") == "get_item_modal":
        item_nm = req.get("item_nm")
        query = f'''
            SELECT *
            FROM INT_ITEM
            WHERE COM_ID = '{com_id}'
            AND USE_YN = 'Y'
            AND (
                    ITEM_NM LIKE CONCAT('%', '{item_nm}', '%') OR
                    ITEM_CD LIKE CONCAT('%', '{item_nm}', '%') OR
                    ITEM_GRP LIKE CONCAT('%', '{item_nm}', '%')
            );
        '''
        itemlist = quex.execall(query)
        contents = itemlist

    ### 구매 요청 목록
    if req.get("action") == "get_odreq":
        st_dt = req.get("st_dt").replace("-", "")
        ed_dt = req.get("ed_dt").replace("-", "")
        odreq_sta = req.get("odreq_sta")
        odreq = quex.proc("get_odreq", [com_id, st_dt, ed_dt, odreq_sta])
        contents = odreq

    ### 구매 등록 모달
    if req.get("action") == "get_acreq_modal":
        item_nm = req.get("item_nm")

        acreq = quex.proc("get_acreq", [com_id, item_nm])
        contents = acreq

    ### 견적 요청 모달
    if req.get("action") == "get_odbiddtl_modal":
        odbid_id = req.get("odbid_id")
        query = f'''
            SELECT *
            FROM INT_ODBID_DTL A
            JOIN INT_ODREQ B ON B.ODREQ_ID = A.ODREQ_ID
            JOIN INT_ITEM C ON C.ITEM_ID = B.ITEM_ID
            WHERE ODBID_ID = '{odbid_id}'
        '''
        contents = quex.execall(query)

    ### 구매 현황
    if req.get("action") == "get_odbid":
        noti_tp = req.get("noti_tp")
        st_dt = req.get("st_dt").replace("-", "")
        ed_dt = req.get("ed_dt").replace("-", "")
        odbid_id = req.get("odbid_id")
        noti_nm = req.get("noti_nm")
        query = f'''
            SELECT 
            ODBID_ID, 
            NOTI_TP, 
            NOTI_NM, 
            DATE_FORMAT(NOTI_DD, '%Y-%m-%d') as NOTI_DD,
            REG_USER, 
            DATE_FORMAT(REG_DATE, '%Y-%m-%d') as REG_DATE,
            NOTI_INFO,
            ATT
            FROM INT_ODBID
            WHERE NOTI_TP LIKE CONCAT('%','{noti_tp}','%')
            AND COM_ID = '{com_id}' 
            AND (REG_DATE BETWEEN '{st_dt}' AND '{ed_dt}')
            AND ODBID_ID LIKE CONCAT('%','{odbid_id}','%')
            AND NOTI_NM LIKE CONCAT('%','{noti_nm}','%')
        '''
        contents = quex.execall(query)

    ### 구매 현황 상세
    if req.get("action") == "get_odbid_dtl":
        ODBID_ID = req.get("ODBID_ID")
        query = f'''
            SELECT *
            FROM INT_ODBID_DTL A
            INNER JOIN INT_ODREQ B ON A.ODREQ_ID = B.ODREQ_ID
            INNER JOIN INT_ITEM C ON B.ITEM_ID = C.ITEM_ID
            WHERE A.COM_ID = '{com_id}'
            AND A.ODBID_ID = '{ODBID_ID}'
        '''
        odbid = quex.execall(query)
        contents = odbid

    ### 견적 받은 공고
    if req.get("action") == "get_offernoti":
        query = f'''
            SELECT IB.ODBID_ID, '공개견적' NOTI_TP, IB.NOTI_NM, IB.REG_USER, COUNT(*) OFFER_CNT, 
            DATE_FORMAT(IB.REG_DATE, '%Y-%m-%d') as REG_DATE, 
            DATE_FORMAT(IB.NOTI_DD, '%Y-%m-%d') as NOTI_DD
            FROM INT_ODBID IB
            JOIN EXT_OFFER EF ON EF.ODBID_ID = IB.ODBID_ID AND EF.ACC_DTS IS NULL
            GROUP BY IB.ODBID_ID, IB.NOTI_NM, IB.REG_USER
            ORDER BY IB.REG_DATE DESC
        '''
        contents = quex.execall(query)

    ### 견적 목록
    if req.get("action") == "get_offer":
        ODBID_ID = req.get("ODBID_ID")
        query = f'''
            SELECT IOB.ODBID_ID, CI.COM_ID, CI.COM_NM, DATE_FORMAT(IOB.REG_DATE, '%Y-%m-%d') as REG_DATE,
                DATE_FORMAT(IOB.NOTI_DD, '%Y-%m-%d') as NOTI_DD, DATE_FORMAT(EXO.OFFER_DTS, '%Y-%m-%d %H:%i:%S') as OFFER_DTS,
                DATE_FORMAT(EXO.CHK_DTS, '%Y-%m-%d %H:%m:%S') as CHK_DTS
            FROM EXT_OFFER EXO
                JOIN INT_ODBID IOB ON IOB.ODBID_ID = EXO.ODBID_ID
                JOIN COMPANY CI ON CI.COM_ID = EXO.COM_ID
            WHERE EXO.ODBID_ID = '{ODBID_ID}'
            AND ACC_DTS IS NULL
            ORDER BY OFFER_DTS DESC
        '''
        contents = quex.execall(query)

    ### 계약 상대자 목록
    if req.get("action") == "get_accoffer":
        query = f'''
            SELECT IB.ODBID_ID, '공개견적' NOTI_TP, IB.NOTI_NM,  DATE_FORMAT(IB.REG_DATE, '%Y-%m-%d') as REG_DATE,
                IB.REG_USER, CI.COM_ID, CI.COM_NM,
                DATE_FORMAT(EO.OFFER_DTS, '%Y-%m-%d') as OFFER_DTS, DATE_FORMAT(EO.ACC_DTS, '%Y-%m-%d') as ACC_DTS
            FROM EXT_OFFER EO
                JOIN INT_ODBID IB ON IB.ODBID_ID = EO.ODBID_ID
                JOIN COMPANY CI ON CI.COM_ID = EO.COM_ID
                LEFT JOIN BID_CONTRACT CT ON CT.ODBID_ID = EO.ODBID_ID
            WHERE IB.COM_ID = '{com_id}'
            AND EO.ACC_DTS IS NOT NULL
            AND CT.ODBID_ID IS NULL
            ORDER BY EO.ACC_DTS DESC
        '''
        contents = quex.execall(query)

    ### 견적 디테일
    if req.get("action") == "get_offerdtl":
        ODBID_ID = req.get("ODBID_ID")
        COM_ID = req.get("COM_ID")

        query = f'''
            SELECT *, (OFFER_AMU*ITEM_QT) OFFER_AM
            FROM INT_ODBID_DTL A
            INNER JOIN INT_ODREQ B ON A.ODREQ_ID = B.ODREQ_ID
            INNER JOIN INT_ITEM C ON B.ITEM_ID = C.ITEM_ID 
            INNER JOIN EXT_OFFER EO ON EO.ODBID_ID = A.ODBID_ID AND EO.COM_ID = '{COM_ID}'
            INNER JOIN EXT_OFFER_DTL EOD ON EOD.ODBID_ID = EO.ODBID_ID AND EOD.COM_ID = EO.COM_ID
            	AND EOD.ODBID_NO = A.ODBID_NO
            WHERE A.ODBID_ID = '{ODBID_ID}'
        '''
        contents = quex.execall(query)

        p_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
        query = f'''
            UPDATE EXT_OFFER
            SET CHK_DTS = '{p_datetime}'
            WHERE ODBID_ID = '{ODBID_ID}'
            AND COM_ID = '{COM_ID}'
        '''
        quex.execall(query)
        
    ### 진행중 계약
    if req.get("action") == "get_ingcont":
        query = f'''
            SELECT "공개견적" AS CONT_STA, CT.CONT_ID, CT.CONT_NM, CP.COM_NM AS ECOM_NM, 
            DATE_FORMAT(EO.ACC_DTS, '%Y-%m-%d') as ACC_DT, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') as CONT_DT, CT.REG_USER
            FROM BID_CONTRACT CT
                JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
                JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
                JOIN COMPANY CP ON CP.COM_ID = EO.COM_ID
            WHERE CT.COM_ID = '{com_id}'
        '''
        contents = quex.execall(query)
        
    ### 완료된 계약
    if req.get("action") == "get_confcont":
        CONT_ID = req.get("confcont_contid")
        CONT_NM = req.get("confcont_contnm")
        CONT_STDT = req.get("confcont_contstdt").replace("-", "")
        CONT_EDDT = req.get("confcont_conteddt").replace("-", "")
        query = f'''
            SELECT "공개견적" AS CONT_STA, CT.CONT_ID, CT.CONT_NM, CP.COM_NM AS ECOM_NM, 
            DATE_FORMAT(EO.ACC_DTS, '%Y-%m-%d') as ACC_DT, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') as CONT_DT, CT.REG_USER
            FROM BID_CONTRACT CT
                JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
                JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
                JOIN COMPANY CP ON CP.COM_ID = EO.COM_ID
            WHERE CT.COM_ID = '{com_id}'
            AND CT.CONF_DT IS NOT NULL
            AND CT.CONT_ID LIKE CONCAT('%', '{CONT_ID}', '%')
            AND CT.CONT_NM LIKE CONCAT('%', '{CONT_NM}', '%')
            AND (CT.CONF_DT BETWEEN '{CONT_STDT}' AND '{CONT_EDDT}')
        '''
        contents = quex.execall(query)

    ### 품목 관리
    if req.get("action") == "get_itemlist":
        item_nm = ""
        itemlist = quex.proc("get_itemlist", [com_id, item_nm])
        contents = itemlist

    ### 사용자 관리
    if req.get("action") == "data4_2_1":
        userlist = quex.proc("get_userlist", [com_id])
        contents = userlist

    response = {
        "result": "true",
        "data": {
            "contents": contents
        }
    }
    return JsonResponse(response)
