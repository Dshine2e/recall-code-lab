import random
random.seed(5524)
n = 200000
m = 1000
t = [random.randint(1, m) for _ in range(n)]
print(n, m)
print(*t)
