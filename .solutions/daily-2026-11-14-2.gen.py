import random

random.seed(2026111402)
n = 200000
m = 200000
out = [f"{n} {m} 1 {n}"]
# 긴 사슬 일부 + 무작위 간선
for i in range(1, 100001):
    out.append(f"{i} {i + 1}")
for _ in range(m - 100000):
    a = random.randint(1, n)
    b = random.randint(1, n)
    while b == a:
        b = random.randint(1, n)
    out.append(f"{a} {b}")
print("\n".join(out))
