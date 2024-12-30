from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from common.forms import UserForm
from django.contrib.auth.views import LoginView


class CustomLoginView(LoginView):
    def post(self, request, *args, **kwargs):
        req = request.POST
        print(req)
        # if "slogin" in req:
        #     req['username'] = req['susername']
        #     req['password'] = req['gpassword']
        #     print("수요")
        # else:
        #     req['username'] = req['gusername']
        #     req['password'] = req['spassword']
        #     print("공급")
        # print(req)

        # 원래 LoginView의 post 메소드 호출
        return super().post(request, *args, **kwargs)


def index(request):
    return redirect('/int/')


def signup(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)  # 사용자 인증
            login(request, user)  # 로그인
            return redirect('/')
    else:
        form = UserForm()
    return render(request, 'common/signup.html', {'form': form})
