import random

random.seed(20261127)
parts = []
length = 0
LIMIT = 200_000
while True:
    num = str(random.choice([random.randint(0, 9), random.randint(10**8, 10**9)]))
    if length + len(num) > LIMIT:
        break
    parts.append(num)
    length += len(num)
    if length + 2 > LIMIT:
        break
    parts.append(random.choice("**+-*"))
    length += 1
if not parts[-1][0].isdigit():
    parts.pop()
print("".join(parts))
