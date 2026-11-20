import sys
from collections import deque

MOD = 1_000_000_007


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    for i in range(m):
        u, v = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        adj[u].append(v)
        adj[v].append(u)
    dist = [-1] * (n + 1)
    ways = [0] * (n + 1)
    dist[1], ways[1] = 0, 1
    q = deque([1])
    while q:
        u = q.popleft()
        du, wu = dist[u] + 1, ways[u]
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = du
                ways[v] = wu
                q.append(v)
            elif dist[v] == du:
                ways[v] = (ways[v] + wu) % MOD
    if dist[n] == -1:
        print(-1)
    else:
        print(dist[n], ways[n])


main()
