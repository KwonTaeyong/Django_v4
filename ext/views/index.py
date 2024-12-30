from django.shortcuts import render
from . import quex

def index(request):
    context = {
    }
    return render(request, 'ext/e_menu1/e_menu1_1.html', context)


def menu1_1(request):
    context = {
    }
    return render(request, 'ext/e_menu1/e_menu1_1.html', context)


def menu1_2(request):
    context = {
    }
    return render(request, 'ext/e_menu1/e_menu1_2.html', context)


def notidetail(request):
    req = request.GET
    ODBID_ID = req.get("odbidid")
    query = f'''
        SELECT ODBID_ID, NOTI_TP, NOTI_NM, NOTI_INFO, ATT, DATE_FORMAT(NOTI_DD, '%Y-%m-%d') NOTI_DD
        FROM INT_ODBID
        WHERE ODBID_ID = '{ODBID_ID}'
    '''
    odbidInfo = quex.execall(query)
    context = odbidInfo[0]

    return render(request, 'ext/e_menu1/notidetail.html', context)



def menu1_3(request):
    context = {
    }
    return render(request, 'ext/e_menu1/e_menu1_3.html', context)


def menu2_1(request):
    context = {
    }
    return render(request, 'ext/e_menu2/e_menu2_1.html', context)


def menu2_2(request):
    context = {
    }
    return render(request, 'ext/e_menu2/e_menu2_2.html', context)

def offerdetail(request):
    req = request.GET
    ODBID_ID = req.get("odbidid")
    query = f'''
        SELECT ODBID_ID, NOTI_TP, NOTI_NM, NOTI_INFO, ATT, DATE_FORMAT(NOTI_DD, '%Y-%m-%d') NOTI_DD
        FROM INT_ODBID
        WHERE ODBID_ID = '{ODBID_ID}'
    '''
    context = quex.execall(query)[0]
    return render(request, 'ext/e_menu2/offerdetail.html', context)

def menu3_1(request):
    context = {
    }
    return render(request, 'ext/e_menu3/e_menu3_1.html', context)


def menu3_2(request):
    context = {
    }
    return render(request, 'ext/e_menu3/e_menu3_2.html', context)

def contdetail(request):
    req = request.GET
    CONT_ID = req.get("contid")
    query = f'''
        SELECT CT.CONT_ID, CT.ODBID_ID, CP.COM_ID, CT.CONT_BODY, OB.NOTI_TP, CT.CONT_NM, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') CONT_DT,
            CT.CONT_DEPO, DATE_FORMAT(CT.DELIVE_STDT, '%Y-%m-%d') DELIVE_STDT, 
            DATE_FORMAT(CT.DELIVE_EDDT, '%Y-%m-%d') DELIVE_EDDT, CT.DELIVE_ADD, CT.CONT_RMK,
            CP.COM_NM AS ICOM_NM
        FROM BID_CONTRACT CT
            JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
            JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
            JOIN COMPANY CP ON CP.COM_ID = OB.COM_ID
        WHERE CT.CONT_ID = '{CONT_ID}'
    '''
    context = quex.execall(query)[0]
    return render(request, 'ext/e_menu3/contdetail.html', context)

def confcontdetail(request):
    req = request.GET
    CONT_ID = req.get("contid")
    query = f'''
        SELECT CT.CONT_ID, CT.ODBID_ID, CP.COM_ID, CT.CONT_BODY, OB.NOTI_TP, CT.CONT_NM, DATE_FORMAT(CT.CONT_DT, '%Y-%m-%d') CONT_DT,
            CT.CONT_DEPO, DATE_FORMAT(CT.DELIVE_STDT, '%Y-%m-%d') DELIVE_STDT, 
            DATE_FORMAT(CT.DELIVE_EDDT, '%Y-%m-%d') DELIVE_EDDT, CT.DELIVE_ADD, CT.CONT_RMK,
            CP.COM_NM AS ICOM_NM
        FROM BID_CONTRACT CT
            JOIN INT_ODBID OB ON OB.ODBID_ID = CT.ODBID_ID
            JOIN EXT_OFFER EO ON EO.ODBID_ID = CT.ODBID_ID AND EO.ACC_DTS IS NOT NULL
            JOIN COMPANY CP ON CP.COM_ID = OB.COM_ID
        WHERE CT.CONT_ID = '{CONT_ID}'
    '''
    context = quex.execall(query)[0]
    return render(request, 'ext/e_menu3/confcontdetail.html', context)

def menu4_1(request):
    context = {
    }
    return render(request, 'ext/e_menu4/menu4_1.html', context)
