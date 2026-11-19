import random

random.seed(2026111905)
n, k = 200000, 50000
print(n, k)
print(" ".join(str(random.randint(1, 60000) * 16661) for _ in range(n)))
