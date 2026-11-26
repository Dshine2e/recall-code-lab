import random
random.seed(112609)
n = 200000
k = 100000
a = [random.randint(1, 10**9) for _ in range(n)]
print(n, k)
print(" ".join(map(str, a)))
