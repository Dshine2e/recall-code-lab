import random

random.seed(2026111907)
n, k = 200000, 3
print(n, k)
out = []
for _ in range(n):
    l = random.randint(0, 10**9 - 1)
    r = min(10**9, l + random.randint(1, 20000))
    out.append(f"{l} {r}")
print("\n".join(out))
