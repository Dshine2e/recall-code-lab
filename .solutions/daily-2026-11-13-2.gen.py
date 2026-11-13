import random

random.seed(2026111302)
n = 200000
out = [str(n)]
for _ in range(n):
    s = random.randint(0, 10**9 - 1)
    e = random.randint(s + 1, min(10**9, s + 10**7))
    out.append(f"{s} {e}")
print("\n".join(out))
