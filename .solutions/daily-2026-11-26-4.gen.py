import random
random.seed(112604)
n = 200000
# 대부분 서로 다른 큰 번호이고, 일부만 멀리 떨어져 다시 나온다
vals = random.sample(range(1, 10**9 + 1), n)
for _ in range(300):
    i = random.randrange(n - 5000)
    j = i + random.randint(2000, 4999)
    vals[j] = vals[i]
print(n)
print(" ".join(map(str, vals)))
