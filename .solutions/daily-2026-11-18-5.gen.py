import random

random.seed(2026111805)
q = 200000
print(" ".join(str(random.randint(0, 100000)) for _ in range(5)))
print(q)
lines = []
for _ in range(q):
    price = random.randint(1, 10000) * 10
    ins = [random.randint(0, 100) for _ in range(5)]
    if random.random() < 0.3:
        ins = [random.randint(0, 3) for _ in range(5)]
    lines.append(" ".join(map(str, [price] + ins)))
print("\n".join(lines))
