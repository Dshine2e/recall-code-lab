import random

random.seed(31)
N = 200000
M = 200000
K = 40000000000000
lines = ["%d %d %d" % (N, M, K)]
for _ in range(M):
    a = random.randint(1, N)
    b = random.randint(1, N)
    if a > b:
        a, b = b, a
    lines.append("%d %d %d" % (a, b, random.randint(1, 1000000000)))
print("\n".join(lines))
