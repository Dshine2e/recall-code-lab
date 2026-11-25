import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    r, c = int(data[0]), int(data[1])
    rows = data[2:2 + r]
    W = c + 2
    g = bytearray(b'#' * (W * (r + 2)))
    for i in range(r):
        g[(i + 1) * W + 1:(i + 1) * W + 1 + c] = rows[i]
    INF = 1 << 30
    n = len(g)
    smoke = [INF] * n
    q = deque()
    start = -1
    for p in range(n):
        ch = g[p]
        if ch == 42:  # '*'
            smoke[p] = 0
            q.append(p)
        elif ch == 83:  # 'S'
            start = p
    moves = (1, -1, W, -W)
    wall = 35
    while q:
        p = q.popleft()
        d = smoke[p] + 1
        for m in moves:
            np_ = p + m
            if g[np_] != wall and smoke[np_] == INF:
                smoke[np_] = d
                q.append(np_)
    dist = [-1] * n
    dist[start] = 0
    q.append(start)
    E = 69
    while q:
        p = q.popleft()
        d = dist[p]
        if g[p] == E:
            print(d)
            return
        d += 1
        for m in moves:
            np_ = p + m
            if g[np_] != wall and dist[np_] < 0 and smoke[np_] > d:
                dist[np_] = d
                q.append(np_)
    print(-1)


main()
