# 先导入包
from django.urls import path,include
from game.views.settings.getinfo import InfoView
from game.views.settings.register import PlayerView
from game.views.settings.ranklist import RanklistView
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # 获取JWT的函数（登录）
    TokenRefreshView,   # 刷新access token的函数
)

# 路由名，函数名，名字
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("getinfo/",InfoView.as_view(),name="settings_getinfo"),
    # 引入jwt后删去 login/ logout/
    # path("login/",signin,name="settings_login"),
    # path("logout/", signout, name="settings_logout"),
    path("register/", PlayerView.as_view(), name="settings_register"),
    path("ranklist/",RanklistView.as_view(),name="settings_ranklist"),
    path("acwing/",include("game.urls.settings.acwing.index")),

]


