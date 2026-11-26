import random
random.seed(112606)
L = 10**9
n = 200000
out = [f"{L} {n}"]
for _ in range(n):
    s = random.randrange(L - 1)
    e = min(L, s + random.randint(1, 3000))
    out.append(f"{s} {e}")
print("\n".join(out))
