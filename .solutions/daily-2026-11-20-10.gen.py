import random

random.seed(2026112010)
n = 40
p = [random.randint(10**11, 10**12) for _ in range(n)]
budget = sum(p) // 2 + 12345
print(n, budget)
print(" ".join(map(str, p)))
