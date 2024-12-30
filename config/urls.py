from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('nowon/', admin.site.urls),
    path('robots.txt', TemplateView.as_view(template_name="robots.txt", content_type='text/plain')),

    path('', include('common.urls')),
    path('int/', include('int.urls')),
    path('ext/', include('ext.e_urls')),
]
