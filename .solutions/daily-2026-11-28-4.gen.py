import random
random.seed(20261128)
n = 200000
a = list(range(1, n + 1))
random.shuffle(a)
print(n)
print(" ".join(map(str, a)))
