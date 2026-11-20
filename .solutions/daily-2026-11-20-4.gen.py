import random

random.seed(2026112004)
n, m = 200000, 200000
edges = set()
# 앞쪽 절반은 긴 사슬 모양(깊은 DFS), 나머지는 무작위 간선
for i in range(1, 100000):
    edges.add((i, i + 1))
while len(edges) < m:
    u = random.randint(100001, n)
    v = random.randint(100001, n)
    if u != v and (u, v) not in edges and (v, u) not in edges:
        edges.add((u, v))
edges = list(edges)
random.shuffle(edges)
print(n, m)
print("\n".join(f"{u} {v}" for u, v in edges))
