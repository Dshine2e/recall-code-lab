import random
random.seed(7231)
n = q = 200000
s = "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(n))
out = [f"{n} {q}", s]
for _ in range(q):
    l = random.randint(1, n); r = random.randint(l, n)
    out.append(f"{l} {r}")
print("\n".join(out))
