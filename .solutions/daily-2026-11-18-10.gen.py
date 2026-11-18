import random

random.seed(2026111810)
h = w = 300
g = [[random.choices(".#o", [85, 10, 5])[0] for _ in range(w)] for _ in range(h)]
# 꺾임이 많이 필요하도록 가로벽을 번갈아 세우고 한쪽 끝만 틔운다
for r in range(5, h - 1, 6):
    for c in range(w):
        g[r][c] = "#"
        g[r - 3][c] = "." if g[r - 3][c] == "#" else g[r - 3][c]
    hole = w - 1 if (r // 6) % 2 == 0 else 0
    for rr in range(r - 2, r + 3):
        for cc in range(max(0, hole - 2), min(w, hole + 3)):
            g[rr][cc] = "."
g[0][0] = "A"
g[h - 1][w - 1] = "B"
print(h, w)
for row in g:
    print("".join(row))
