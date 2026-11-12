import random
import string

random.seed(2026111226)
LIMIT = 200000
letters = string.ascii_lowercase
# 서로 다른 이름 3000개(일부는 다른 이름의 앞부분이 되도록 섞는다)
names = set()
while len(names) < 3000:
    names.add("".join(random.choice(letters) for _ in range(random.randint(1, 10))))
names = sorted(names)

parts = []
length = 0
while True:
    name = random.choice(names)
    if random.random() < 0.7:
        token = f"{name}*{random.randint(1, 10**9)}"
    else:
        token = name
    sep = "" if not parts else random.choice([",", ", "])
    if length + len(sep) + len(token) > LIMIT:
        break
    parts.append(sep + token)
    length += len(sep) + len(token)
print("".join(parts))
