import random

random.seed(5271127)
Q = 200_000
lines = [str(Q)]
for _ in range(Q):
    r = random.random()
    if r < 0.35:
        lines.append(f"1 {random.randint(1, 10**9)}")
    elif r < 0.7:
        lines.append(f"2 {random.randint(1, 10**9)}")
    elif r < 0.85:
        lines.append("3")
    else:
        lines.append("4")
print("\n".join(lines))
