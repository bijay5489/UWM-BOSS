from .functions import user_login, user_logout
from django.contrib.auth.decorators import login_required

# Example login view
def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        return user_login(request, username, password)

# Example logout view
@login_required
def logout_view(request):
    return user_logout(request)