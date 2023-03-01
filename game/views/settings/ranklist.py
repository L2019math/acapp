from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player


class RanklistView(APIView):
    # 需要授权可访问
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        # - score 从大到小排序， score 从小到大排序
        players = Player.objects.all().order_by('-score')[:10]
        resp = []
        for player in players:
            resp.append({
                'username': player.user.username,
                'photo': player.photo,
                'score': player.score,
            })
        return Response(resp)
