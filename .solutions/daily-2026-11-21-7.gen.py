import random

random.seed(2026112107)
n, k = 200000, 3
print(n, k)
rows = []
for i in range(n):
    if i % 4 == 0:
        s = random.randint(0, 10**9 - 1)
        e = random.randint(s + 1, min(10**9, s + 10**7))
    else:
        s = random.randint(0, 10**9 - 1)
        e = random.randint(s + 1, 10**9)
    rows.append(f"{s} {e}")
print("\n".join(rows))
