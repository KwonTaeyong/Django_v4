from django.shortcuts import render
from . import quex

context = {}


### 인덱스
def index(request):
    return render(request, 'int/i_index.html', context)


### 구매요청
def odreq_reg(request):
    return render(request, 'int/i1_odreq/i1_1_odreq_reg.html', context)

def odreq_list(request):
    return render(request, 'int/i1_odreq/i1_2_odreq_list.html', context)

def odreq_listerp(request):
    return render(request, 'int/i1_odreq/i1_3_odreq_listerp.html', context)

### 구매견적
def od_req(request):
    return render(request, 'int/i2_odbid/i2_1_od_reg.html', context)

def od_list(request):
    return render(request, 'int/i2_odbid/i2_2_od_list.html', context)

def bid_reg(request):
    return render(request, 'int/i2_odbid/i2_3_bid_reg.html', context)

def bid_list(request):
    return render(request, 'int/i2_odbid/i2_4_bid_list.html', context)


### 계약
def cont_list(request):
    return render(request, 'int/i3_cont/i3_1_cont_list.html', context)


def cont_acc(request):
    return render(request, 'int/i3_cont/i3_2_cont_acc.html', context)


def cont_ing(request):
    return render(request, 'int/i3_cont/i3_3_cont_ing.html', context)


def cont_conf(request):
    return render(request, 'int/i3_cont/i3_4_cont_conf.html', context)


### 품목 관리
def item_reg(request):
    return render(request, 'int/i4_item/i4_2_item_reg.html', context)

def item_regexcel(request):
    return render(request, 'int/i4_item/i4_3_item_regexcel.html', context)

def item_list(request):
    return render(request, 'int/i4_item/i4_1_item_list.html', context)


### 조직 관리
def company_info(request):
    com_id = request.user.last_name
    companyinfo = quex.proc("get_companyinfo", [com_id])[0]
    context["companyinfo"] = companyinfo

    return render(request, 'int/i5_company/i4_1_company_info.html', context)