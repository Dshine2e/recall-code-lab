import random

random.seed(2026111906)
n, m = 200000, 200000
print(n, m)
ts = sorted(random.randint(0, 10**9) for _ in range(n))
print("\n".join(f"{t} {random.randint(0, 10**9)}" for t in ts))
bs = sorted(random.sample(range(1, 10**9 + 1), m))
print("\n".join(f"{b} {random.randint(1, 3)}" for b in bs))
