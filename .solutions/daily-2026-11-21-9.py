import sys


def find_marks(g, h, w):
    mark = [[False] * w for _ in range(h)]
    found = False
    for r in range(h):
        c = 0
        while c < w:
            e = c
            while e + 1 < w and g[r][e + 1] == g[r][c]:
                e += 1
            if g[r][c] != "." and e - c + 1 >= 3:
                found = True
                for k in range(c, e + 1):
                    mark[r][k] = True
            c = e + 1
    for c in range(w):
        r = 0
        while r < h:
            e = r
            while e + 1 < h and g[e + 1][c] == g[r][c]:
                e += 1
            if g[r][c] != "." and e - r + 1 >= 3:
                found = True
                for k in range(r, e + 1):
                    mark[k][c] = True
            r = e + 1
    return mark if found else None


def main():
    data = sys.stdin.read().split()
    h, w = int(data[0]), int(data[1])
    g = [list(data[2 + i]) for i in range(h)]
    pos = 2 + h
    q = int(data[pos])
    pos += 1
    score = 0
    invalid = 0
    for _ in range(q):
        r1, c1, r2, c2 = (int(x) - 1 for x in data[pos:pos + 4])
        pos += 4
        if g[r1][c1] == "." or g[r2][c2] == ".":
            invalid += 1
            continue
        g[r1][c1], g[r2][c2] = g[r2][c2], g[r1][c1]
        mark = find_marks(g, h, w)
        if mark is None:
            g[r1][c1], g[r2][c2] = g[r2][c2], g[r1][c1]
            invalid += 1
            continue
        t = 0
        while mark is not None:
            t += 1
            removed = 0
            for r in range(h):
                for c in range(w):
                    if mark[r][c]:
                        g[r][c] = "."
                        removed += 1
            score += removed * t
            for c in range(w):
                col = [g[r][c] for r in range(h) if g[r][c] != "."]
                col = ["."] * (h - len(col)) + col
                for r in range(h):
                    g[r][c] = col[r]
            mark = find_marks(g, h, w)
    out = [str(score), str(invalid)] + ["".join(row) for row in g]
    print("\n".join(out))


main()
