from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time
# Create your views here.
def getToken(request):
    appId = '007eJxTYOAMu5l4r8ijT43dnnlHsfgK5f7Oi7s3zvzrsTqB5catM2EKDJamqSaGiUnmyebJliYGSaaWqRapaaYmBkbGSQaWZhbJP1JU0xoCGRnuF9QwMzIwMrAAMYjPBCaZwSQLlMxNzMxjYAAAXgQhuA=='
    appCertificate = '02ab5400d7bb4a339ca21144ff9ed25f'
    channelName = request.GET.get('channel')
    uid = random.randint(1,230)
    experationTimeInSeconds =3600*24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + experationTimeInSeconds
    role = 1
    token = oken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token,'uid':uid} , safe=False)

def lobby(request):
    return render(request,'call/lobby.html')


def room(request):
    return render(request,'call/room.html')