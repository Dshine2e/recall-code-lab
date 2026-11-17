import random

random.seed(2026111707)
q = 200000
lines = [str(q)]
for i in range(q):
    r = random.random()
    if r < 0.30:
        lines.append(f"F {random.randint(1, 10**9)}")
    elif r < 0.60:
        lines.append(f"B {random.randint(1, 10**9)}")
    elif r < 0.80:
        lines.append("R")
    elif r < 0.90:
        lines.append("P")
    else:
        lines.append("D")
print("\n".join(lines))
