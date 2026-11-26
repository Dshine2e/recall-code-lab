import random
random.seed(112607)
n = 100000
out = [str(n)]
for _ in range(2 * n):
    out.append(f"{random.randint(9 * 10**8, 10**9)} {random.randint(9 * 10**8, 10**9)}")
print("\n".join(out))
