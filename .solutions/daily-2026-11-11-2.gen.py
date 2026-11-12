import random
random.seed(20261111)
n = q = 200000
a = sorted(random.sample(range(-10**9, 10**9 + 1), n))
print(n)
print(*a)
print(q)
print(*(random.choice(a) if random.random() < 0.5 else random.randint(-10**9, 10**9) for _ in range(q)))
