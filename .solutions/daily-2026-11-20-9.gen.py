import random

random.seed(2026112009)
h = w = 100000
k = 2000
cells = set()
# 대각선 근처에 몰아서 서로 앞뒤 관계인 쌍이 많게 만든다
while len(cells) < k:
    t = random.randint(1, 100000)
    r = min(h, max(1, t + random.randint(-50, 50)))
    c = min(w, max(1, t + random.randint(-50, 50)))
    if (r, c) not in ((1, 1), (h, w)):
        cells.add((r, c))
cells = list(cells)
random.shuffle(cells)
print(h, w, k)
print("\n".join(f"{r} {c}" for r, c in cells))
