import random

random.seed(2026112105)
n = 200000
print(n)
rows = []
for i in range(n):
    if i % 3 == 0:
        rows.append(f"1000 {random.randint(1, 1000)}")
    else:
        rows.append(f"{random.randint(1, 1000)} {random.randint(1, 1000)}")
print("\n".join(rows))
