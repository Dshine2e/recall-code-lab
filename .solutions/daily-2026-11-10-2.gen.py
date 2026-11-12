import random
random.seed(20261110)
n = 200000
print(n)
print(" ".join(str(random.randint(-10**9, 10**9)) for _ in range(n)))
