import random

random.seed(2026111303)
n = 200000
# 깊이가 매우 깊어지도록 앞부분은 긴 사슬, 나머지는 무작위로 붙이고 번호를 섞는다
perm = list(range(2, n + 1))
random.shuffle(perm)
label = [0, 1] + perm  # label[k] = k번째로 놓인 정점의 실제 번호
parent = [0] * (n + 1)
for k in range(2, n + 1):
    if k <= n // 2:
        pk = k - 1
    else:
        pk = random.randint(1, k - 1)
    parent[label[k]] = label[pk]
a = [random.randint(1, 10**9) for _ in range(n)]
print(n)
print(" ".join(map(str, a)))
print(" ".join(str(parent[i]) for i in range(2, n + 1)))
