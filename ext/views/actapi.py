from rest_framework.response import Response
from rest_framework.views import APIView
from querystring_parser import parser
from . import quex
from datetime import datetime


class act(APIView):
    def get(self, request):
        com_id = request.user.last_name
        req = request.GET
        response = {}
        response['state'] = 0
        response['message'] = ""
        response['data'] = []

    def post(self, request):
        com_id = request.user.last_name
        reg_user = request.user.first_name
        req = request.POST
        response = {}
        response['state'] = 0
        response['message'] = ""

        ### 관심공고 등록
        if req.get("action") == "reg_notifavor":
            odbid_id = req.get("odbid_id")

            query = f'''
                SELECT *
                FROM EXT_NOTIFAVOR
                WHERE 
                    COM_ID = '{com_id}' AND 
                    ODBID_ID = '{odbid_id}'
            '''
            exist = quex.execone(query)

            if exist:
                response['message'] = "이미 등록 한 공고입니다."
                return Response(response)

            query = f'''
                INSERT INTO EXT_NOTIFAVOR
                    (COM_ID, ODBID_ID)
                VALUES
                    ('{com_id}', '{odbid_id}');
            '''
            quex.execall(query)

            response['state'] = 1
            response['message'] = "관심공고로 등록하였습니다."
            return Response(response)

        ### 관심공고 해제
        if req.get("action") == "del_notifavor":
            checkedRows = parser.parse(req.urlencode())['checkedRows']
            for key in checkedRows.keys():
                row = checkedRows[key]
                odbid_id = row["ODBID_ID"]
                query = f'''
                    DELETE FROM EXT_NOTIFAVOR
                    WHERE COM_ID = '{com_id}'
                    AND ODBID_ID = '{odbid_id}'
                '''
                quex.execall(query)

            response['state'] = 1
            response['message'] = "선택 한 관심공고를 해제하였습니다."
            return Response(response)

        ### 견적서 전송
        if req.get("action") == "send_offer":
            dataList = parser.parse(req.urlencode())['dataList']
            ODBID_ID = dataList[0]["ODBID_ID"]
            query = f'''
                SELECT *
                FROM EXT_OFFER
                WHERE 
                    COM_ID = '{com_id}' AND 
                    ODBID_ID = '{ODBID_ID}'
            '''
            exist = quex.execone(query)
            if exist:
                response['message'] = "이미 견적을 등록한 공고입니다."
                return Response(response)

            p_datetime = datetime.now().strftime('%Y%m%d%H%M%S')

            query = f'''
                INSERT INTO EXT_OFFER
                    (COM_ID, ODBID_ID, OFFER_DTS)
                VALUES
                    ('{com_id}', '{ODBID_ID}', '{p_datetime}');
            '''
            quex.execall(query)
            for key in dataList.keys():
                row = dataList[key]
                ODBID_NO = row["ODBID_NO"]
                OFFER_AMU = row["OFFER_AMU"]
                query = f'''
                    INSERT INTO EXT_OFFER_DTL
                        (COM_ID, ODBID_ID, ODBID_NO, OFFER_AMU)
                    VALUES
                        ('{com_id}', '{ODBID_ID}', '{ODBID_NO}', '{OFFER_AMU}');
                '''
                quex.execall(query)

            response['state'] = 1
            response['message'] = "견적서를 전송하였습니다."
            return Response(response)

        ### 견적서 수정
        if req.get("action") == "edit_offer":
            updatedRows = parser.parse(req.urlencode())['modifiedRows']['updatedRows']
            ODBID_ID = updatedRows[0]['ODBID_ID']
            query = f'''
                SELECT *
                FROM EXT_OFFER
                WHERE ODBID_ID = '{ODBID_ID}'
                AND COM_ID = '{com_id}'
                AND ACC_DTS IS NOT NULL
            '''
            if quex.execone(query):
                response['message'] = "승인 된 견적은 수정 할 수 없습니다."
                return Response(response)

            p_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
            query = f'''
                UPDATE EXT_OFFER
                SET OFFER_DTS = '{p_datetime}', CHK_DTS = NULL
            '''
            quex.execall(query)

            for key, row in updatedRows.items():
                OFFER_AMU = row['OFFER_AMU']
                ODBID_NO = row['ODBID_NO']
                query = f'''
                    UPDATE EXT_OFFER_DTL
                    SET OFFER_AMU = '{OFFER_AMU}'
                    WHERE ODBID_ID = '{ODBID_ID}'
                    AND COM_ID = '{com_id}'
                    AND ODBID_NO = '{ODBID_NO}'
                '''
                quex.execall(query)
            response['state'] = 1
            response['message'] = "보낸 견적을 수정하였습니다."
            return Response(response)

        ### 계약 확정
        if req.get("action") == "conf_cont":
            CONT_ID = req.get('cont_id')
            CONF_DT = datetime.now().strftime('%Y%m%d')
            query = f'''
                UPDATE BID_CONTRACT
                SET CONF_DT = '{CONF_DT}'
                WHERE CONT_ID = '{CONT_ID}'
            '''
            quex.execall(query)
            response['state'] = 1
            response['message'] = "계약에 서명하였습니다."
            return Response(response)
