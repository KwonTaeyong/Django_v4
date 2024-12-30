from django.urls import path
from .views import index, gridapi, actapi

app_name = 'ext'

urlpatterns = [
    path('', index.index, name='index'),

    path('allnotilist/', index.menu1_1, name='menu1_1'),
    path('menu1_2/', index.menu1_2, name='menu1_2'),
    path('menu1_3/', index.menu1_3, name='menu1_3'),
    path('notidetail/', index.notidetail, name='notidetail'),

    path('menu2_1/', index.menu2_1, name='menu2_1'),
    path('menu2_2/', index.menu2_2, name='menu2_2'),
    path('offerdetail/', index.offerdetail, name='offerdetail'),

    path('menu3_1/', index.menu3_1, name='menu3_1'),
    path('menu3_2/', index.menu3_2, name='menu3_2'),
    path('contdetail/', index.contdetail, name='contdetail'),
    path('confcontdetail/', index.confcontdetail, name='confcontdetail'),

    path('menu4_1/', index.menu4_1, name='menu4_1'),

    path('e_gridapi/', gridapi.data, name='e_griddata'),
    path('actapi/', actapi.act.as_view(), name='actapi'),
]
