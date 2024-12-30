from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views import *

app_name = 'common'

urlpatterns = [
    path('', index, name='index'),
    path('common/login/', CustomLoginView.as_view(template_name='common/login.html'), name='login'),
    path('common/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('common/signup/', signup, name='signup'),
]