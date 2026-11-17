import random

random.seed(2026111709)
length = 10**9
k = 300
cuts = random.sample(range(1, length), k)
print(length, k)
print(" ".join(map(str, cuts)))
