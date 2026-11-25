import random
random.seed(112509)
n = m = 200000
perm = list(range(1, n + 1))
random.shuffle(perm)
edges = []
# 앞 절반은 사슬, 뒤 절반은 무작위 앞→뒤 간선이라 힙에 원소가 많이 쌓인다
half = n // 2
for i in range(half - 1):
    edges.append((perm[i], perm[i + 1]))
while len(edges) < m:
    i, j = sorted(random.sample(range(n), 2))
    edges.append((perm[i], perm[j]))
random.shuffle(edges)
print(n, m)
print("\n".join(f"{a} {b}" for a, b in edges))
