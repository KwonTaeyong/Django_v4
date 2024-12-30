from django.shortcuts import render
from querystring_parser import parser
from . import quex

def get_modal(request):
    req = request.GET
    action = req.get("action")
    context = {}

    if action == "get_item":
        return render(request, 'int/i1_odreq/i1_1m_itemlist.html', context)

    if action == "get_acreq":
        return render(request, 'int/i2_odbid/i2_3m_getodreq.html', context)

    if action == "get_odbid":
        params = parser.parse(req.urlencode())['params']
        ODBID_ID = params["ODBID_ID"]
        query = f'''
            SELECT ODBID_ID, NOTI_TP, NOTI_NM, NOTI_INFO, ATT, DATE_FORMAT(NOTI_DD, '%Y-%m-%d') NOTI_DD
            FROM INT_ODBID
            WHERE ODBID_ID = '{ODBID_ID}'
        '''
        context = quex.execall(query)[0]
        return render(request, 'int/i2_odbid/i2_5m_odbid.html', context)

    if action == "get_offer":
        params = parser.parse(req.urlencode())['params']
        ODBID_ID = params["ODBID_ID"]
        COM_ID = params["COM_ID"]
        query = f'''
            SELECT IB.ODBID_ID, IB.NOTI_TP, IB.NOTI_NM, IB.NOTI_INFO, IB.ATT, DATE_FORMAT(IB.NOTI_DD, '%Y-%m-%d') NOTI_DD, C.COM_NM, C.COM_ID
            FROM INT_ODBID IB
            JOIN EXT_OFFER EF ON EF.ODBID_ID = IB.ODBID_ID
            JOIN COMPANY C ON C.COM_ID = EF.COM_ID
            WHERE IB.ODBID_ID = '{ODBID_ID}'
            AND EF.COM_ID = '{COM_ID}'
        '''
        context = quex.execall(query)[0]
        return render(request, 'int/i3_cont/i3_1m_offer_list.html', context)

    if action == "get_accoffer":
        params = parser.parse(req.urlencode())['params']
        ODBID_ID = params["ODBID_ID"]
        COM_ID = params["COM_ID"]
        query = f'''
            SELECT IB.ODBID_ID, IB.NOTI_TP, IB.NOTI_NM, IB.NOTI_INFO, IB.ATT, DATE_FORMAT(IB.NOTI_DD, '%Y-%m-%d') NOTI_DD, C.COM_NM, C.COM_ID
            FROM INT_ODBID IB
            JOIN EXT_OFFER EF ON EF.ODBID_ID = IB.ODBID_ID
            JOIN COMPANY C ON C.COM_ID = EF.COM_ID
            WHERE IB.ODBID_ID = '{ODBID_ID}'
            AND EF.COM_ID = '{COM_ID}'
        '''
        context = quex.execall(query)[0]
        return render(request, 'int/i3_cont/i3_2m_accoffer.html', context)

    if action == "get_ingcont":
        params = parser.parse(req.urlencode())['params']
        CONT_ID = params["CONT_ID"]
        query = f'''
            SELECT CT.CONT_ID, CT.ODBID_ID, CP.COM_ID, CT.CONT_BODY, OB.NOTI_TP, CT.CONT_NM, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') CONT_DT,
                CT.CONT_DEPO, DATE_FORMAT(CT.DELIVE_STDT, '%Y-%m-%d') DELIVE_STDT, 
                DATE_FORMAT(CT.DELIVE_EDDT, '%Y-%m-%d') DELIVE_EDDT, CT.DELIVE_ADD, CT.CONT_RMK,
                CP.COM_NM AS ECOM_NM
            FROM BID_CONTRACT CT
                JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
                JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
                JOIN COMPANY CP ON CP.COM_ID = EO.COM_ID
            WHERE CT.CONT_ID = '{CONT_ID}'
        '''
        context = quex.execall(query)[0]
        return render(request, 'int/i3_cont/i3_3m_ingcont.html', context)

    if action == "get_confcont":
        params = parser.parse(req.urlencode())['params']
        CONT_ID = params["CONT_ID"]
        query = f'''
            SELECT CT.CONT_ID, CT.ODBID_ID, CP.COM_ID, CT.CONT_BODY, OB.NOTI_TP, CT.CONT_NM, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') CONT_DT,
                CT.CONT_DEPO, DATE_FORMAT(CT.DELIVE_STDT, '%Y-%m-%d') DELIVE_STDT, 
                DATE_FORMAT(CT.DELIVE_EDDT, '%Y-%m-%d') DELIVE_EDDT, CT.DELIVE_ADD, CT.CONT_RMK,
                CP.COM_NM AS ECOM_NM
            FROM BID_CONTRACT CT
                JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
                JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
                JOIN COMPANY CP ON CP.COM_ID = EO.COM_ID
            WHERE CT.CONT_ID = '{CONT_ID}'
        '''
        context = quex.execall(query)[0]
        return render(request, 'int/i3_cont/i3_4m_confcont.html', context)
