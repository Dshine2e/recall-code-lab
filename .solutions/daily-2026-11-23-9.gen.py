import random
random.seed(9923)
n = 200000
out = [str(n)]
for i in range(n):
    if i % 2:
        k = random.randint(1, 10 ** 9 - 1)
        a, b = k, k + random.randint(0, 1)
    else:
        a, b = random.randint(1, 10 ** 9), random.randint(1, 10 ** 9)
    if random.random() < 0.5:
        a, b = b, a
    out.append(f"{a} {b}")
print("\n".join(out))
