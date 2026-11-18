import random

random.seed(2026111808)
n = q = 200000
print(n)
print(" ".join(str(random.randint(1, 10**9)) for _ in range(n)))
print(q)
lines = []
for _ in range(q):
    lines.append(f"{random.randint(1, n)} {random.randint(1, n)}")
print("\n".join(lines))
