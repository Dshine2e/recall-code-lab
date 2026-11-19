import sys
from collections import deque

def main():
    data = sys.stdin.read().split()
    r, c = int(data[0]), int(data[1])
    g = data[2:2 + r]
    dist = [[-1] * c for _ in range(r)]
    for i in range(r):
        j = g[i].find("S")
        if j >= 0:
            s = (i, j)
        j = g[i].find("E")
        if j >= 0:
            e = (i, j)
    moves = [(1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)]
    dist[s[0]][s[1]] = 0
    q = deque([s])
    while q:
        y, x = q.popleft()
        d = dist[y][x] + 1
        for dy, dx in moves:
            ny, nx = y + dy, x + dx
            if 0 <= ny < r and 0 <= nx < c and dist[ny][nx] < 0 and g[ny][nx] != "#":
                dist[ny][nx] = d
                q.append((ny, nx))
    print(dist[e[0]][e[1]])

main()
