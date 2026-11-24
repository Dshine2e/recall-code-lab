import random
random.seed(7724)
n = 500
print(n)
for i in range(n):
    if i == 0:
        print(0, 0, 10 ** 9, 10 ** 9)
        continue
    x1 = random.randint(0, 10 ** 9 - 1)
    x2 = random.randint(x1 + 1, 10 ** 9)
    y1 = random.randint(0, 10 ** 9 - 1)
    y2 = random.randint(y1 + 1, 10 ** 9)
    print(x1, y1, x2, y2)
