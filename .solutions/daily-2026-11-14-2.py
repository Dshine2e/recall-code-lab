import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, m, s, k = int(data[0]), int(data[1]), int(data[2]), int(data[3])
    adj = [[] for _ in range(n + 1)]
    idx = 4
    for _ in range(m):
        a, b = int(data[idx]), int(data[idx + 1])
        idx += 2
        adj[a].append(b)
        adj[b].append(a)
    dist = [-1] * (n + 1)
    dist[s] = 0
    q = deque([s])
    cnt = 0
    while q:
        u = q.popleft()
        if dist[u] == k:
            continue
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                cnt += 1
                q.append(v)
    print(cnt)


main()
