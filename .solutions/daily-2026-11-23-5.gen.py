import random
random.seed(1123)
n = m = 1000
q = 200000
out = [f"{n} {m} {q}"]
for i in range(n):
    out.append(" ".join(str(random.randint(0, 10 ** 9)) for _ in range(m)))
for _ in range(q):
    r1 = random.randint(1, n); r2 = random.randint(r1, n)
    c1 = random.randint(1, m); c2 = random.randint(c1, m)
    t = random.randint(1, 600)
    out.append(f"{r1} {c1} {r2} {c2} {t}")
print("\n".join(out))
