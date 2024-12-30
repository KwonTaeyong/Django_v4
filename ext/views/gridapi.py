from django.http import JsonResponse
from . import quex


def data(request):
    com_id = request.user.last_name
    req = request.GET
    contents = []

    ### 구매 요청
    if req.get("action") == "get_allNoti":
        companyName = req.get("companyName")
        title = req.get("title")
        st_dt = req.get("st_dt").replace("-", "")
        ed_dt = req.get("ed_dt").replace("-", "")

        query = f'''
            SELECT A.ODBID_ID, A.NOTI_TP, A.NOTI_NM, B.COM_NM, DATE_FORMAT(A.REG_DATE, '%Y-%m-%d') as REG_DATE, DATE_FORMAT(A.NOTI_DD, '%Y-%m-%d') as NOTI_DD
            FROM INT_ODBID A
                JOIN COMPANY B ON A.COM_ID = B.COM_ID
                LEFT JOIN EXT_OFFER C ON C.ODBID_ID = A.ODBID_ID AND C.COM_ID = A.COM_ID
            WHERE B.COM_NM LIKE CONCAT('%', '{companyName}', '%')
            AND A.NOTI_NM LIKE CONCAT('%', '{title}', '%') 
            AND (A.REG_DATE BETWEEN '{st_dt}' AND '{ed_dt}')
            AND C.COM_ID IS NULL
        '''
        noti_list = quex.execall(query)
        contents = noti_list

    if req.get("action") == "get_favorNoti":
        query = f'''
            SELECT A.ODBID_ID, A.NOTI_TP, A.NOTI_NM, B.COM_NM, DATE_FORMAT(A.REG_DATE, '%Y-%m-%d') as REG_DATE, DATE_FORMAT(A.NOTI_DD, '%Y-%m-%d') as NOTI_DD
            FROM INT_ODBID A
                JOIN COMPANY B ON A.COM_ID = B.COM_ID
                JOIN EXT_NOTIFAVOR C ON C.COM_ID = '{com_id}' AND C.ODBID_ID = A.ODBID_ID
                LEFT JOIN EXT_OFFER EXO ON EXO.ODBID_ID = A.ODBID_ID AND EXO.COM_ID = A.COM_ID
            WHERE EXO.COM_ID IS NULL
        '''
        noti_list = quex.execall(query)
        contents = noti_list

    if req.get("action") == "get_notidetail":
        ODBID_ID = req.get("odbid_id")

        query = f'''
            SELECT *
            FROM INT_ODBID_DTL A
            INNER JOIN INT_ODREQ B ON A.ODREQ_ID = B.ODREQ_ID
            INNER JOIN INT_ITEM C ON B.ITEM_ID = C.ITEM_ID
            AND A.ODBID_ID = '{ODBID_ID}'
        '''
        notidetail_itemlist = quex.execall(query)
        contents = notidetail_itemlist

    if req.get("action") == "get_offer":
        query = f'''
            SELECT IOB.ODBID_ID, IOB.NOTI_TP, IOB.NOTI_NM, CI.COM_NM, DATE_FORMAT(IOB.REG_DATE, '%Y-%m-%d') as REG_DATE,
                DATE_FORMAT(IOB.NOTI_DD, '%Y-%m-%d') as NOTI_DD, DATE_FORMAT(EXO.OFFER_DTS, '%Y-%m-%d %H:%i:%S') as OFFER_DTS,
                DATE_FORMAT(EXO.CHK_DTS, '%Y-%m-%d %H:%m:%S') as CHK_DTS,
                (CASE WHEN EXO.CHK_DTS IS NULL THEN '접수' ELSE '확인' END) as OFFER_STA 
            FROM EXT_OFFER EXO
                JOIN INT_ODBID IOB ON IOB.ODBID_ID = EXO.ODBID_ID
                JOIN COMPANY CI ON CI.COM_ID = IOB.COM_ID
            WHERE EXO.COM_ID = '{com_id}'
            AND ACC_DTS IS NULL
            ORDER BY OFFER_DTS DESC
        '''
        offer_list = quex.execall(query)
        contents = offer_list

    if req.get("action") == "get_accoffer":
        query = f'''
            SELECT IOB.ODBID_ID, IOB.NOTI_TP, IOB.NOTI_NM, CI.COM_NM, DATE_FORMAT(IOB.REG_DATE, '%Y-%m-%d') as REG_DATE,
                DATE_FORMAT(IOB.NOTI_DD, '%Y-%m-%d') as NOTI_DD, DATE_FORMAT(EXO.OFFER_DTS, '%Y-%m-%d %H:%i:%S') as OFFER_DTS,
                DATE_FORMAT(EXO.ACC_DTS, '%Y-%m-%d %H:%i:%S') as ACC_DTS, '승인' as OFFER_STA 
            FROM EXT_OFFER EXO
                JOIN INT_ODBID IOB ON IOB.ODBID_ID = EXO.ODBID_ID
                JOIN COMPANY CI ON CI.COM_ID = IOB.COM_ID
                LEFT JOIN BID_CONTRACT CT ON CT.ODBID_ID = EXO.ODBID_ID
            WHERE EXO.COM_ID = '{com_id}'
            AND ACC_DTS IS NOT NULL
            AND CT.ODBID_ID IS NULL
            ORDER BY OFFER_DTS DESC
        '''
        offer_list = quex.execall(query)
        contents = offer_list

    ### 견적 상세
    if req.get("action") == "get_offerdetail":
        ODBID_ID = req.get("odbid_id")
        query = f'''
            SELECT *, (OFFER_AMU*ITEM_QT) OFFER_AM
            FROM INT_ODBID_DTL A
            INNER JOIN INT_ODREQ B ON A.ODREQ_ID = B.ODREQ_ID
            INNER JOIN INT_ITEM C ON B.ITEM_ID = C.ITEM_ID
            INNER JOIN EXT_OFFER_DTL EXO ON EXO.ODBID_ID = A.ODBID_ID AND EXO.ODBID_NO = A.ODBID_NO
            WHERE A.ODBID_ID = '{ODBID_ID}'
        '''
        contents = quex.execall(query)

    ### 진행중 계약
    if req.get("action") == "get_ingcont":
        query = f'''
            SELECT "공개견적" AS CONT_STA, CT.CONT_ID, CT.CONT_NM, CP.COM_NM AS ICOM_NM, 
            DATE_FORMAT(EO.ACC_DTS, '%Y-%m-%d') as ACC_DT, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') as CONT_DT, CT.REG_USER
            FROM BID_CONTRACT CT
                JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
                JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
                JOIN COMPANY CP ON CP.COM_ID = OB.COM_ID
            WHERE CT.COM_ID = '{com_id}'
            AND CT.CONF_DT IS NULL
        '''
        contents = quex.execall(query)

    ### 진행중 계약
    if req.get("action") == "get_confcont":
        CONT_ID = req.get("confcont_contid")
        CONT_NM = req.get("confcont_contnm")
        CONT_STDT = req.get("confcont_contstdt").replace("-", "")
        CONT_EDDT = req.get("confcont_conteddt").replace("-", "")
        query = f'''
            SELECT "공개견적" AS CONT_STA, CT.CONT_ID, CT.CONT_NM, CP.COM_NM AS ICOM_NM, 
            DATE_FORMAT(EO.ACC_DTS, '%Y-%m-%d') as ACC_DT, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') as CONT_DT, CT.REG_USER,
            DATE_FORMAT(CT.CONF_DT, '%Y-%m-%d') as CONF_DT
            FROM BID_CONTRACT CT
                JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
                JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
                JOIN COMPANY CP ON CP.COM_ID = OB.COM_ID
            WHERE CT.COM_ID = '{com_id}'
            AND CT.CONF_DT IS NOT NULL
            AND CT.CONT_ID LIKE CONCAT('%', '{CONT_ID}', '%')
            AND CT.CONT_NM LIKE CONCAT('%', '{CONT_NM}', '%')
            AND (CT.CONF_DT BETWEEN '{CONT_STDT}' AND '{CONT_EDDT}')
        '''
        contents = quex.execall(query)

    response = {
        "result": "true",
        "data": {
            "contents": contents
        }
    }
    return JsonResponse(response)
