import random
random.seed(1128008)
n = 200000
k = 100000
s = [str(random.randint(1, 9))] + [str(random.randint(0, 9)) for _ in range(n - 1)]
print(n, k)
print("".join(s))
