import random

random.seed(2026111403)
n = 200000
out = [str(n)]
for _ in range(n):
    t = random.randint(1, 10**9)
    d = random.randint(1, 10**9)
    out.append(f"{t} {d}")
print("\n".join(out))
