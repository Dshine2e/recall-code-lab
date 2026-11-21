import random
random.seed(2026112204)
n = q = 200000
print(n, q)
print(" ".join(str(random.choice([1, 10**9, random.randint(1, 10**9)])) for _ in range(n)))
print(" ".join(str(random.choice([0, 10**18, random.randint(0, 10**18), random.randint(0, 10**14)])) for _ in range(q)))
