from django.urls import path
from .views import index, gridapi, actapi, modal

app_name = 'int'

urlpatterns = [
    path('', index.index, name='index'),

    ### 구매요청
    path('regodreq/', index.odreq_reg, name='odreq_reg'),
    path('odreqlist/', index.odreq_list, name='odreq_list'),
    path('erpodreqlist/', index.odreq_listerp, name='odreq_listerp'),

    ### 구매견적
    path('regod/', index.od_req, name='od_reg'),
    path('odlist/', index.od_list, name='od_list'),
    path('regodbid/', index.bid_reg, name='bid_reg'),
    path('odbidlist/', index.bid_list, name='bid_list'),

    ### 계약
    path('contlist/', index.cont_list, name='cont_list'),
    path('acccont/', index.cont_acc, name='cont_acc'),
    path('ingcont/', index.cont_ing, name='cont_ing'),
    path('confcont/', index.cont_conf, name='cont_conf'),

    ### 품목 관리
    path('regitem/', index.item_reg, name='item_reg'),
    path('regitemexcel/', index.item_regexcel, name='item_regexcel'),
    path('itemlist/', index.item_list, name='item_list'),

    ### 조직관리
    path('companyinfo/', index.company_info, name='company_info'),

    ### 그리드API
    path('gridapi/', gridapi.data, name='gridapi'),

    ### 액션API
    path('actapi/', actapi.act.as_view(), name='actapi'),

    ### 모달API
    path('side_modal/', modal.get_modal, name='modal'),
]
