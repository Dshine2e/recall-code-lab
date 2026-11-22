import random
random.seed(623)
n = 200000
a = [random.choice([-10 ** 9, 10 ** 9, random.randint(-10 ** 9, 10 ** 9)]) for _ in range(n)]
b = [(-x if i % 2 else random.randint(-10 ** 9, 10 ** 9)) for i, x in enumerate(a)]
print(n)
print(" ".join(map(str, a)))
print(" ".join(map(str, b)))
