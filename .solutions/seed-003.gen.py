import random

random.seed(2026111203)
n, m, q = 500, 500, 200000
out = [f"{n} {m}"]
for _ in range(n):
    out.append(" ".join(str(random.randint(0, 10**9)) for _ in range(m)))
out.append(str(q))
for i in range(q):
    # 작은 반경, 격자를 넘는 큰 반경, 최대 반경을 섞는다
    roll = i % 4
    if roll == 0:
        k = random.randint(0, 5)
    elif roll == 1:
        k = random.randint(0, 600)
    elif roll == 2:
        k = 1000
    else:
        k = random.randint(0, 1000)
    out.append(f"{random.randint(1, n)} {random.randint(1, m)} {k}")
print("\n".join(out))
