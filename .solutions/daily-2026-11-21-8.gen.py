import random

random.seed(2026112108)
n = 200000
vals = []
for i in range(n):
    r = random.random()
    if r < 0.3:
        vals.append(random.randint(-10**9, 10**9))
    elif r < 0.5:
        vals.append(random.choice([-10**9, 10**9, 0]))
    else:
        vals.append(i * 5000 - 5 * 10**8)  # 계속 커지는 값
print(n)
print(" ".join(map(str, vals)))
