import random

random.seed(2026112006)
n = 200000
print(n)
print(" ".join(str(random.choice([1000000000, 999999999, -5, 0, random.randint(-10**9, 10**9)])) for _ in range(n)))
