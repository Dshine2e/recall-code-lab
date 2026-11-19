import random

random.seed(2026111909)
n, q = 100000, 100000
print(n, q)
print(" ".join(str(random.randint(-10**9, 10**9)) for _ in range(n)))
out = []
for _ in range(q):
    l = random.randint(1, n)
    r = random.randint(l, n)
    if random.random() < 0.5:
        out.append(f"1 {l} {r} {random.randint(-10**9, 10**9)}")
    else:
        out.append(f"2 {l} {r}")
print("\n".join(out))
