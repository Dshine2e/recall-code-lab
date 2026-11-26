import random
random.seed(112605)
n = 200000
k = 100000
# 점수가 점점 커지는 흐름이 섞여 있어 힙 교체가 자주 일어난다
vals = [min(10**9, i * 4000 + random.randint(0, 10**8)) for i in range(n)]
print(n, k)
print(" ".join(map(str, vals)))
