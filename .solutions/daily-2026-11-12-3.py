import sys
import heapq

def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        u, v, w = int(data[idx]), int(data[idx + 1]), int(data[idx + 2])
        idx += 3
        adj[u].append((v, w))
        adj[v].append((u, w))
    INF = 1 << 62
    d0 = [INF] * (n + 1)  # 통행권을 아직 안 쓴 상태
    d1 = [INF] * (n + 1)  # 통행권을 이미 쓴 상태
    d0[1] = 0
    pq = [(0, 1, 0)]
    push, pop = heapq.heappush, heapq.heappop
    while pq:
        d, u, used = pop(pq)
        if used:
            if d > d1[u]:
                continue
            for v, w in adj[u]:
                nd = d + w
                if nd < d1[v]:
                    d1[v] = nd
                    push(pq, (nd, v, 1))
        else:
            if d > d0[u]:
                continue
            for v, w in adj[u]:
                nd = d + w
                if nd < d0[v]:
                    d0[v] = nd
                    push(pq, (nd, v, 0))
                if d < d1[v]:  # 이 다리에서 통행권 사용
                    d1[v] = d
                    push(pq, (d, v, 1))
    ans = min(d0[n], d1[n])
    print(-1 if ans >= INF else ans)

main()
