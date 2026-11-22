import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, m, s, t = int(data[0]), int(data[1]), int(data[2]), int(data[3])
    adj = [[] for _ in range(n + 1)]
    edges = []
    pos = 4
    for _ in range(m):
        u, v, w = int(data[pos]), int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        edges.append((u, v, w))
        adj[u].append((v, w))
        adj[v].append((u, w))
    INF = float("inf")

    def dijkstra(src):
        dist = [INF] * (n + 1)
        dist[src] = 0
        pq = [(0, src)]
        while pq:
            d, x = heapq.heappop(pq)
            if d > dist[x]:
                continue
            for y, w in adj[x]:
                nd = d + w
                if nd < dist[y]:
                    dist[y] = nd
                    heapq.heappush(pq, (nd, y))
        return dist

    ds = dijkstra(s)
    if ds[t] == INF:
        print(-1)
        return
    dt = dijkstra(t)
    best = ds[t]
    on = [i for i, (u, v, w) in enumerate(edges, 1)
          if ds[u] + w + dt[v] == best or ds[v] + w + dt[u] == best]
    print(best, len(on))
    print(" ".join(map(str, on)))


main()
