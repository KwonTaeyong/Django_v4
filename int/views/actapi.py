from rest_framework.response import Response
from rest_framework.views import APIView
from querystring_parser import parser
from . import quex
from datetime import datetime
from urllib.parse import parse_qs

class act(APIView):
    def post(self, request):
        com_id = request.user.last_name
        reg_user = request.user.first_name
        req = request.POST
        response = {}
        response['state'] = 0
        response['message'] = ""

        ### 아이템 저장
        if req.get("action") == "save_item":
            modifiedRows = parser.parse(req.urlencode())['modifiedRows']
            if "createdRows" in modifiedRows:
                createdRows = modifiedRows["createdRows"]
                for key in createdRows.keys():
                    row = createdRows[key]
                    if not row["ITEM_NM"]:
                        continue
                    COM_ID = com_id
                    ITEM_NM = row["ITEM_NM"]
                    ITEM_CD = row["ITEM_CD"]
                    ITEM_UNIT = row["ITEM_UNIT"]
                    ITEM_STND = row["ITEM_STND"]
                    ITEM_GRP = row["ITEM_GRP"]
                    ITEM_BRAND = row["ITEM_BRAND"]
                    HSCODE = row["HSCODE"]
                    BARCODE = row["BARCODE"]
                    REG_USER = reg_user
                    USE_YN = row["USE_YN"]
                    RMK = row["RMK"]
                    quex.proc("ins_item", [
                        COM_ID, ITEM_NM, ITEM_CD, ITEM_UNIT,
                        ITEM_STND, ITEM_GRP, ITEM_BRAND, HSCODE, BARCODE,
                        REG_USER, USE_YN, RMK
                    ])
            if "updatedRows" in modifiedRows:
                updatedRows = modifiedRows["updatedRows"]
                for key in updatedRows.keys():
                    row = updatedRows[key]
                    if not row["ITEM_NM"]:
                        continue
                    COM_ID = com_id
                    ITEM_ID = row["ITEM_ID"]
                    ITEM_NM = row["ITEM_NM"]
                    ITEM_CD = row["ITEM_CD"]
                    ITEM_UNIT = row["ITEM_UNIT"]
                    ITEM_STND = row["ITEM_STND"]
                    ITEM_GRP = row["ITEM_GRP"]
                    ITEM_BRAND = row["ITEM_BRAND"]
                    HSCODE = row["HSCODE"]
                    BARCODE = row["BARCODE"]
                    USE_YN = row["USE_YN"]
                    RMK = row["RMK"]
                    quex.proc("upd_item", [
                        COM_ID, ITEM_ID, ITEM_NM, ITEM_CD, ITEM_UNIT,
                        ITEM_STND, ITEM_GRP, ITEM_BRAND, HSCODE, BARCODE,
                        USE_YN, RMK
                    ])
            if "deletedRows" in modifiedRows:
                deletedRows = modifiedRows["deletedRows"]
                for key in deletedRows.keys():
                    row = deletedRows[key]
                    ITEM_ID = row["ITEM_ID"]
                    quex.proc("del_item", [com_id, ITEM_ID])

            response['state'] = 1
            response['message'] = "변경사항을 저장하였습니다."
            return Response(response)

        ### 요청 등록
        if req.get('action') == 'ins_odreq':
            checkedRows = parser.parse(req.urlencode())['checkedRows']
            for key in checkedRows.keys():
                row = checkedRows[key]

                required_fields = ["ITEM_QT"]
                for field in required_fields:
                    if not row[field]:
                        response["state"] = 0
                        response["message"] = f"필수 값이 누락 되어 실패하였습니다. {field} : {row[field]}"
                        return Response(response)

                quex.proc("ins_odreq", [
                    com_id,
                    request.user.first_name,
                    "001",
                    row["ITEM_ID"],
                    int(row["ITEM_QT"]),
                    row["REQDUE_DT"].replace('-', ''),
                    request.user.first_name,
                    row["RMK"]
                ])
            response["state"] = 1
            return Response(response)

        ### 요청 승인
        if req.get('action') == 'acc_odreq':
            checkedRows = parser.parse(req.urlencode())['checkedRows']
            for key in checkedRows.keys():
                row = checkedRows[key]
                odreq_id = row["ODREQ_ID"]
                odreq_sta = "002"
                quex.proc("upd_odreq", [
                    com_id,
                    odreq_id,
                    odreq_sta,
                    request.user.first_name
                ])
            response["state"] = 1
            return Response(response)

        ### 요청 반려
        if req.get('action') == 'rej_odreq':
            checkedRows = parser.parse(req.urlencode())['checkedRows']
            for key in checkedRows.keys():
                row = checkedRows[key]
                odreq_id = row["ODREQ_ID"]
                odreq_sta = "003"
                quex.proc("upd_odreq", [
                    com_id,
                    odreq_id,
                    odreq_sta,
                    request.user.first_name
                ])
            response["state"] = 1
            return Response(response)

        ### 요청 회수
        if req.get('action') == 'del_odreq':
            checkedRows = parser.parse(req.urlencode())['checkedRows']
            for key in checkedRows.keys():
                row = checkedRows[key]
                odreq_id = row["ODREQ_ID"]
                quex.proc("del_odreq", [odreq_id])
            response["state"] = 1
            return Response(response)

        ### 구매 등록
        if req.get('action') == 'ins_odbid':
            NOTI_TP = req.get('NOTI_TP')
            NOTI_DD = req.get('NOTI_DD').replace('-', '')
            NOTI_NM = req.get('NOTI_NM')
            NOTI_INFO = req.get('NOTI_INFO')
            allRows = parser.parse(req.urlencode())['allRows']

            current_date = datetime.now().strftime('%Y%m%d')
            odbid_id = quex.execone(f"SELECT MAX(ODBID_ID) ODBID_ID FROM INT_ODBID WHERE REG_DATE = '{current_date}';")[
                0]
            if odbid_id:
                x = odbid_id[:6]
                no = odbid_id[6:]
                new_no = str(int(no) + 1).zfill(5)
                new_odbid_id = x + new_no
            else:
                new_odbid_id = current_date[2:] + "00001"

            query = f'''
                INSERT INTO INT_ODBID
                    (COM_ID, ODBID_ID, ODBID_STA, NOTI_NM, NOTI_TP, NOTI_DD, NOTI_INFO, ATT, REG_USER, REG_DATE, MOD_USER, MOD_DATE, RMK)
                VALUES
                    ('{com_id}', '{new_odbid_id}', '001', '{NOTI_NM}', '{NOTI_TP}', '{NOTI_DD}', '{NOTI_INFO}', '', '{reg_user}', '{current_date}', NULL, NULL, '');
            '''
            quex.execall(query)

            VALUES = ''
            for i in allRows:
                row = allRows[i]

                if i:
                    VALUES += ','
                i += 1
                VALUES += f"('{com_id}','{new_odbid_id}',{i},'{row['ODREQ_ID']}')"

            query = f'''
                INSERT INTO INT_ODBID_DTL
                (COM_ID, ODBID_ID, ODBID_NO, ODREQ_ID)
                VALUES {VALUES}
            '''
            quex.execall(query)

            response['state'] = 1
            return Response(response)

        ### 계약 상대자 결정
        if req.get('action') == 'acc_offer':
            ODBID_ID = req.get("ODBID_ID")
            COM_ID = req.get("COM_ID")
            p_dts = datetime.now().strftime('%Y%m%d%H%M%S')
            query = f'''
                UPDATE EXT_OFFER
                SET ACC_DTS = '{p_dts}'
                WHERE ODBID_ID = '{ODBID_ID}'
                AND COM_ID = '{COM_ID}'
            '''
            quex.execall(query)

            response['state'] = 1
            return Response(response)
        
        ### 계약서 초안 작성
        if req.get('action') == 'reg_newcont':
            cont_info = parser.parse(req.get('cont_info'))
            ODBID_ID = cont_info["odbid_id"]
            CONT_NM = cont_info["cont_nm"]
            CONT_BODY = cont_info["cont_body"]
            CONT_DT = cont_info["cont_dt"].replace("-", "")
            CONT_DEPO = cont_info["cont_depo"]
            DELIVE_STDT = cont_info["delive_stdt"].replace("-", "")
            DELIVE_EDDT = cont_info["delive_eddt"].replace("-", "")
            DELIVE_ADD = cont_info["delive_add"]
            CONT_RMK = cont_info["cont_rmk"]

            query = f'''
                SELECT *
                FROM BID_CONTRACT
                WHERE 
                    COM_ID = '{com_id}' AND 
                    ODBID_ID = '{ODBID_ID}'
            '''
            if quex.execone(query):
                response['message'] = "이미 계약이 진행되고 있는 구매 건입니다."
                return Response(response)

            current_date = datetime.now().strftime('%Y%m%d')
            cont_id = quex.execone(f"SELECT MAX(CONT_ID) CONT_ID FROM BID_CONTRACT WHERE DATE_FORMAT(REG_DTS, '%Y%m%d') = '{current_date}';")[
                0]
            if cont_id:
                x = cont_id[:6]
                no = cont_id[6:]
                new_no = str(int(no) + 1).zfill(5)
                new_cont_id = x + new_no
            else:
                new_cont_id = current_date[2:] + "00001"
            reg_dts = datetime.now().strftime('%Y%m%d%H%M%S')

            query = f'''
                INSERT INTO BID_CONTRACT
                (CONT_ID, COM_ID, ODBID_ID, CONT_NM, CONT_BODY, CONT_DT, CONT_DEPO, DELIVE_STDT, DELIVE_EDDT, DELIVE_ADD, CONT_RMK,
                 REG_USER, REG_DTS)
                VALUES
                ('{new_cont_id}', '{com_id}', '{ODBID_ID}', '{CONT_NM}', '{CONT_BODY}', '{CONT_DT}', '{CONT_DEPO}', '{DELIVE_STDT}',
                 '{DELIVE_EDDT}', '{DELIVE_ADD}', '{CONT_RMK}', '{reg_user}', '{reg_dts}')
            '''
            quex.execall(query)

            response['state'] = 1
            return Response(response)

        ### 회사정보 저장
        if req.get('action') == 'save_companyInfo':
            PHONE = req.get("PHONE")
            EMAIL = req.get("EMAIL")
            ZIPCODE = req.get("ZIPCODE")
            ADRESS1 = req.get("ADRESS1")
            ADRESS2 = req.get("ADRESS2")
            query = f'''
                UPDATE COMPANY
                SET 
                    PHONE = '{PHONE}',
                    EMAIL = '{EMAIL}',
                    ZIPCODE = '{ZIPCODE}',
                    ADRESS1 = '{ADRESS1}',
                    ADRESS2 = '{ADRESS2}'
                WHERE COM_ID = '{com_id}'
            '''
            quex.execall(query)

            response['state'] = 1
            return Response(response)
