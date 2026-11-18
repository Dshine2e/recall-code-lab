import random

random.seed(2026111807)
n = q = 200000
print(n, q)
lines = []
for t in range(q):
    if t < q // 2:
        l, r = 1, n
        c = 10000
    else:
        l = random.randint(1, n)
        r = random.randint(l, n)
        c = random.randint(1, 10000)
    lines.append(f"{l} {r} {c}")
print("\n".join(lines))
