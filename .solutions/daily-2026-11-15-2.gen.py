import random

random.seed(2026111502)
n = 200000
out = [str(n)]
for i in range(n):
    if i % 50 == 0:
        s = random.randint(0, 10**9 - 1)
        e = random.randint(s + 1, min(10**9, s + 10**5))
    else:
        s = random.randint(0, 10**9 - 1)
        e = random.randint(s + 1, min(10**9, s + 3000))
    out.append(f"{s} {e}")
print("\n".join(out))
