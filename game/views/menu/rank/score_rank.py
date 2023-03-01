from django.core.paginator import Paginator
from django.conf import settings
from django.http import JsonResponse

from game.models.player.player import Player


def get_players(request):
    player_list = Player.objects.all().order_by('-score')
    players = []
    for player in player_list:
        pd = {}
        pd['name'] = player.user.username
        pd['photo'] = player.photo
        pd['score'] = player.score
        players.append(pd)

    return JsonResponse({
        'result': 'success',
        'players': players,
    })
