import random

random.seed(2026112008)
n = 200000
# 대부분 a_i = i + c 꼴(같은 키가 많아 답이 32비트를 넘음), 일부는 무작위
a = []
for i in range(1, n + 1):
    r = random.random()
    if r < 0.7:
        a.append(i + random.randint(-3, 3))
    else:
        a.append(random.randint(-10**9, 10**9))
print(n)
print(" ".join(map(str, a)))
