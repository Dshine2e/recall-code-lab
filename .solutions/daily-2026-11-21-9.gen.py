import random

rng = random.Random(2026112109)
h = w = 30
q = 1000
letters = "ABCD"  # 글자 종류가 적을수록 연쇄가 길어진다


def make():
    while True:
        g = [[None] * w for _ in range(h)]
        ok = True
        for r in range(h):
            for c in range(w):
                opts = [x for x in letters
                        if not (c >= 2 and g[r][c - 1] == x == g[r][c - 2])
                        and not (r >= 2 and g[r - 1][c] == x == g[r - 2][c])]
                if not opts:
                    ok = False
                    break
                g[r][c] = rng.choice(opts)
            if not ok:
                break
        if ok:
            return g


g = make()
moves = []
for i in range(q):
    # 앞쪽은 아래쪽 칸 위주로 바꿔 큰 연쇄를 노리고, 나머지는 아무 곳이나
    r = rng.randrange(h // 2, h) if i < q // 2 else rng.randrange(h)
    c = rng.randrange(w)
    if rng.random() < 0.5 and c + 1 < w:
        moves.append((r, c, r, c + 1))
    elif r + 1 < h:
        moves.append((r, c, r + 1, c))
    else:
        moves.append((r - 1, c, r, c))
print(h, w)
print("\n".join("".join(row) for row in g))
print(q)
print("\n".join(f"{a + 1} {b + 1} {c + 1} {d + 1}" for a, b, c, d in moves))
