import random
random.seed(101024)
n = 3000
print(n)
for i in range(n):
    print(random.randint(0, 10 ** 6), random.randint(0, 10 ** 6), random.randint(10 ** 11, 10 ** 12) if i % 7 else random.randint(1, 10 ** 12))
