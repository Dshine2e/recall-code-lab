import sys
from collections import deque

def main():
    data = sys.stdin.read().split()
    n, m = int(data[0]), int(data[1])
    a = data[2:2 + n]
    if a[0][0] != "1":
        print(-1)
        return
    dist = [[0] * m for _ in range(n)]
    dist[0][0] = 1
    q = deque([(0, 0)])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < m and a[nx][ny] == "1" and not dist[nx][ny]:
                dist[nx][ny] = dist[x][y] + 1
                q.append((nx, ny))
    print(dist[n - 1][m - 1] if dist[n - 1][m - 1] else -1)

main()
