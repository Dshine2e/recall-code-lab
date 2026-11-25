import random
random.seed(112510)
n = 500000
print(n)
print(" ".join(str(random.randint(1, 10**9)) for _ in range(n)))
