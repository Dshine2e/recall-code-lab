import random
random.seed(2026112209)
n = 16
W = 10**9
print(n, W)
print(" ".join(str(random.randint(2 * 10**8, 6 * 10**8)) for _ in range(n)))
