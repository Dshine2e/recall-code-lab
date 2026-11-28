import random
random.seed(1128006)
n = m = 200000
k = 100000
lines = [f"{n} {m} {k}"]
for _ in range(m):
    lines.append(f"{random.randint(1, n)} {random.randint(1, n)}")
print("\n".join(lines))
