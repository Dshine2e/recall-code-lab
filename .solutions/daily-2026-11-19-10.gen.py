import random

random.seed(2026111910)
n, q = 100000, 100000
print(n)
edges = []
for v in range(2, n + 1):
    # 앞쪽 절반은 긴 사슬, 나머지는 무작위 부모 → 깊은 트리
    p = v - 1 if v <= n // 2 else random.randint(1, v - 1)
    edges.append(f"{p} {v} {random.randint(1, 10**9)}")
random.shuffle(edges)
print("\n".join(edges))
print(q)
out = []
for _ in range(q):
    u, v = random.randint(1, n), random.randint(1, n)
    w = random.randint(1, n) if random.random() < 0.5 else random.choice([u, v, random.randint(1, n // 2)])
    out.append(f"{u} {v} {w}")
print("\n".join(out))
