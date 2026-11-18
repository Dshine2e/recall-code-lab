import sys


def main():
    data = sys.stdin.buffer.read().split()
    pos = 0

    def nxt():
        nonlocal pos
        pos += 1
        return int(data[pos - 1])

    n, m = nxt(), nxt()
    g = [nxt() for _ in range(n)]
    INF = float("inf")
    d = [[INF] * n for _ in range(n)]
    for i in range(n):
        d[i][i] = 0
    for _ in range(m):
        u, v, w = nxt() - 1, nxt() - 1, nxt()
        if w < d[u][v]:
            d[u][v] = d[v][u] = w
    q = nxt()
    queries = []
    for idx in range(q):
        a, b, x = nxt() - 1, nxt() - 1, nxt()
        queries.append((x, a, b, idx))
    queries.sort()
    order = sorted(range(n), key=lambda c: g[c])
    ans = [0] * q
    p = 0
    for x, a, b, idx in queries:
        while p < n and g[order[p]] <= x:
            k = order[p]
            p += 1
            rk = d[k]
            for i in range(n):
                dik = d[i][k]
                if dik == INF:
                    continue
                di = d[i]
                d[i] = [y if y <= dik + z else dik + z for y, z in zip(di, rk)]
        r = d[a][b]
        ans[idx] = -1 if r == INF else r
    sys.stdout.write("\n".join(map(str, ans)) + "\n")


main()
