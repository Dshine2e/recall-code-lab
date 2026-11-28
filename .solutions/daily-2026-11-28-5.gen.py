import random
random.seed(1128005)
n = m = 500
q = 200000
lines = [f"{n} {m} {q}"]
for _ in range(n):
    lines.append(" ".join(str(random.randint(0, 10**9)) for _ in range(m)))
for _ in range(q):
    r1 = random.randint(1, n); r2 = random.randint(r1, n)
    c1 = random.randint(1, m); c2 = random.randint(c1, m)
    lines.append(f"{r1} {c1} {r2} {c2}")
print("\n".join(lines))
