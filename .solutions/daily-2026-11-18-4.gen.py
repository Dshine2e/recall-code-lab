import random

random.seed(2026111804)
n = 200000
h = []
for i in range(n):
    if i < n // 2:
        h.append(random.randint(1, 1000))
    else:
        h.append(random.randint(1, 1000000000))
print(n)
print(" ".join(map(str, h)))
