import random

random.seed(2026111602)
n = q = 200000
out = [f"{n} {q}"]
vals = [random.randint(0, 10**9) for _ in range(n - 1000)] + [500000000] * 1000
random.shuffle(vals)
out.append(" ".join(map(str, vals)))
for _ in range(q):
    a = random.randint(0, 10**9)
    b = random.randint(0, 10**9)
    if a > b:
        a, b = b, a
    out.append(f"{a} {b}")
print("\n".join(out))
