import random

random.seed(2026111704)
n = 200000
vals = [random.randint(1, 10**9) for _ in range(n - 2000)] + [10**9] * 1000 + [1] * 1000
random.shuffle(vals)
print(n, 600000000, 1400000000)
print(" ".join(map(str, vals)))
