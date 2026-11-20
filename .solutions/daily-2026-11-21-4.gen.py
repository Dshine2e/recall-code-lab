import random

random.seed(2026112104)
n = 100000
users = ["".join(random.choice("abcdefghij") for _ in range(random.randint(1, 10))) for _ in range(3000)]
extra_keys = ["path", "ip", "ref", "q", "useragent", "users", "xuser", "byte", "statuses"]
lines = [str(n)]
for _ in range(n):
    toks = [f"user={random.choice(users)}", f"status={random.choice([200, 201, 204, 301, 304, 399, 400, 403, 404, 500, 599])}"]
    if random.random() < 0.8:
        toks.append(f"bytes={random.choice([0, 1000000000, random.randint(0, 10**9)])}")
    for k in random.sample(extra_keys, random.randint(0, 2)):
        toks.append(f"{k}=a=b{random.randint(0, 99)}")
    random.shuffle(toks)
    lines.append(" ".join(toks))
print("\n".join(lines))
