import random

random.seed(2026111603)
n = 200000
vals = [random.randint(1, 10**9) for _ in range(n - 2000)] + [10**9] * 1000 + [1] * 1000
random.shuffle(vals)
print(n)
print(" ".join(map(str, vals)))
