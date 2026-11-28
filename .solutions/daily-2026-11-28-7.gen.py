import random
random.seed(1128007)
n = 200000
# 0이 많이 섞여 답이 크게 나오는 최대 입력
a = [0] * n
for i in range(0, n, 1000):
    a[i] = random.choice([1000000000, -1000000000])
s = sum(a)
a[-1] -= s
print(n)
print(" ".join(map(str, a)))
