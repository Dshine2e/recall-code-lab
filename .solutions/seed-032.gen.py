import random

random.seed(32)
N = 200000
heights = [random.randint(500000000, 1000000000) for _ in range(N)]
print(N)
print(" ".join(map(str, heights)))
