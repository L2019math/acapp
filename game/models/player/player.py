from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    # 说明Player是从User表扩充过来的，每一个player都与一个user是一一对应关联关系
    # 后一个参数是指，当user被删除后，对应的player也要被删除
    # （感觉就是外键的意思）
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    photo = models.URLField(max_length=256, blank = True)
    sex = models.CharField(max_length=256, blank=True)
    openid = models.CharField(default="",max_length=50,blank=True,null = True)
    score = models.IntegerField(default=1500)

    # 指定每个player数据展示在admin界面的数据
    def __str__(self):
        return str(self.user)