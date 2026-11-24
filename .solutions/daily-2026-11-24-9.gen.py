import random
random.seed(9924)
n = m = q = 200000
out = [f"{n} {m} {q}"]
for i in range(m):
    if i < n - 1:
        out.append(f"{i + 1} {i + 2}")
    else:
        out.append(f"{random.randint(1, n // 2)} {random.randint(n // 2 + 1, n)}")
perm = list(range(1, m + 1))
random.shuffle(perm)
out.append(" ".join(map(str, perm)))
print("\n".join(out))
