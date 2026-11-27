import random

random.seed(8271127)
N = 200_000
# 앞 절반은 긴 한 줄, 뒤 절반은 무작위로 붙임. 번호는 사장(1)만 빼고 섞는다.
order = list(range(2, N + 1))
random.shuffle(order)
order = [1] + order
parent = [0] * (N + 1)
half = N // 2
for k in range(1, N):
    if k < half:
        par = order[k - 1]
    else:
        par = order[random.randint(0, k - 1)]
    parent[order[k]] = par
t = [random.randint(10**9 - 1000, 10**9) for _ in range(N)]
print(N)
print(" ".join(map(str, t)))
print(" ".join(str(parent[i]) for i in range(2, N + 1)))
