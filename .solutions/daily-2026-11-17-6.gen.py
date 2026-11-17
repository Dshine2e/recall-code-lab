import random

random.seed(2026111706)
q = 200000
xs = [random.randint(2, 10**6) for _ in range(q - 6)] + [999983, 1000000, 720720, 524288, 2, 999999]
random.shuffle(xs)
print(q)
print("\n".join(map(str, xs)))
