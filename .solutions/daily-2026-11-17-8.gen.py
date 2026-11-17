import random

random.seed(2026111708)
n = 200000
names = set()
while len(names) < n:
    k = random.randint(1, 10)
    names.add("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(k)))
names = sorted(names)
random.shuffle(names)
lines = [str(n)]
for nm in names:
    lines.append(f"{nm} {random.randint(0, 15)} {random.randint(0, 3000)}")
print("\n".join(lines))
