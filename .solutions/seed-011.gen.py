import random

random.seed(2026111211)
n = 100
cap = 25 * 10**9
out = [f"{n} {cap}"]
for i in range(n):
    w = random.randint(1, 10**9)
    v = 1000 if i % 2 == 0 else random.randint(1, 1000)
    out.append(f"{w} {v}")
print("\n".join(out))
