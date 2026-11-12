import random

random.seed(2026111220)
r, c = 400, 500
rows = []
# 위쪽 절반: 한 줄로 길게 이어진 구불구불한 군락(재귀 DFS 깊이를 최대로 만든다)
for i in range(r // 2):
    if i % 2 == 0:
        rows.append("#" * c)
    elif i % 4 == 1:
        rows.append("." * (c - 1) + "#")
    else:
        rows.append("#" + "." * (c - 1))
# 아래쪽 절반: 무작위 잡초(작은 군락이 많이 생긴다)
for i in range(r - r // 2):
    rows.append("".join("#" if random.random() < 0.55 else "." for _ in range(c)))
print(r, c)
print("\n".join(rows))
