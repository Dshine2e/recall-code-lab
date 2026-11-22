import random
random.seed(101123)
n, m = 100000, 200000
s, t = 1, n
edges = []
# 격자처럼 층을 이룬 그래프: 같은 길이의 최단 경로가 아주 많다
width = 100
for v in range(1, n + 1):
    if v + width <= n:
        edges.append((v, v + width, 1000000000))
    if v % width != 0 and v + 1 <= n:
        edges.append((v, v + 1, 1000000000))
while len(edges) < m:
    u = random.randint(1, n); v = random.randint(1, n)
    edges.append((u, v, random.randint(10 ** 9 - 5, 10 ** 9)))
edges = edges[:m]
random.shuffle(edges)
out = [f"{n} {m} {s} {t}"]
out += [f"{u} {v} {w}" for u, v, w in edges]
print("\n".join(out))
