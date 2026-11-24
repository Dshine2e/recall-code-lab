import random
random.seed(6624)
n, k = 200000, 10
out = [f"{n} {k}"]
a = 10 ** 9 - 400000
for i in range(n):
    a += random.randint(0, 2)
    out.append(f"{min(a, 10 ** 9)} {random.randint(1, 10 ** 9) if i % 3 else 10 ** 9}")
print("\n".join(out))
