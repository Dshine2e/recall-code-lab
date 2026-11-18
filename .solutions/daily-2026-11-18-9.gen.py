import random

random.seed(2026111809)
n, m, q = 100, 5000, 100000
print(n, m)
print(" ".join(str(random.randint(1, 10**9)) for _ in range(n)))
edges = []
for _ in range(m):
    u, v = random.sample(range(1, n + 1), 2)
    edges.append(f"{u} {v} {random.randint(1, 10**6)}")
print("\n".join(edges))
print(q)
qs = []
for _ in range(q):
    a, b = random.randint(1, n), random.randint(1, n)
    qs.append(f"{a} {b} {random.randint(0, 10**9)}")
print("\n".join(qs))
