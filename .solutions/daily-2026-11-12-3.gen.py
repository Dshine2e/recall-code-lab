import random

random.seed(2026111203)
n, m = 100000, 200000
edges = []
# 무작위 트리로 연결을 보장하고 나머지는 무작위 다리(같은 쌍 중복 허용)
order = list(range(2, n + 1))
random.shuffle(order)
placed = [1]
for v in order:
    u = random.choice(placed)
    edges.append((u, v, random.randint(1, 10**9)))
    placed.append(v)
while len(edges) < m:
    u = random.randint(1, n)
    v = random.randint(1, n)
    if u != v:
        edges.append((u, v, random.randint(1, 10**9)))
random.shuffle(edges)
out = [f"{n} {m}"]
out.extend(f"{u} {v} {w}" for u, v, w in edges)
print("\n".join(out))
