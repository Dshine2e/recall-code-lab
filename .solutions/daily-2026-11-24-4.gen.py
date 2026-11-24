import random
random.seed(20261124)
n = 200000
k = 3
out = []
for i in range(n):
    if i < 100000:
        out.append(random.randint(1, 3))
    else:
        out.append(random.choice([1, 2, 10 ** 9]))
print(n, k)
print(*out)
