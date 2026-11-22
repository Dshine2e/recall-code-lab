import random
random.seed(20261123)
n = 200000
names = set()
while len(names) < n:
    k = random.randint(6, 10)
    names.add("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(k)))
names = sorted(names)
random.shuffle(names)
lines = [str(n)]
for i, nm in enumerate(names):
    if i % 3 == 0:
        c = random.randint(1, 4)
        s = random.randint(c, 5 * c)
        v = random.randint(0, 3)
    else:
        c = random.randint(1, 10 ** 9)
        s = random.randint(c, 5 * c)
        v = random.randint(0, 10 ** 9)
    lines.append(f"{nm} {v} {s} {c}")
print("\n".join(lines))
