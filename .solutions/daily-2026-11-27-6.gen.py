import random

random.seed(6271127)
N = 200_000
D = 1_000_000_000
a = [random.choice([random.randint(0, 10**9), random.randint(0, 1000)]) for _ in range(N)]
print(N, D)
print(" ".join(map(str, a)))
