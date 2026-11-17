import random

random.seed(2026111710)
n = m = 500
print(n, m)
for i in range(n):
    print(" ".join(str(random.randint(-10**9, 10**9)) for _ in range(m)))
