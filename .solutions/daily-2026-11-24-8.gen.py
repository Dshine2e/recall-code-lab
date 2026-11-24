import random
random.seed(8824)
k = 17
n = 1 << k
print(k)
print(*[random.randint(1, 10 ** 9) for _ in range(n)])
