import random
random.seed(1128009)
n = 2000
print(n)
print(" ".join(str(random.randint(1, 1000000)) for _ in range(n)))
