import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)
    idx = 2
    for _ in range(m):
        a, b = int(data[idx]), int(data[idx + 1])
        idx += 2
        adj[a].append(b)
        indeg[b] += 1
    heap = [v for v in range(1, n + 1) if indeg[v] == 0]
    heapq.heapify(heap)
    order = []
    unique = True
    while heap:
        if len(heap) > 1:
            unique = False
        v = heapq.heappop(heap)
        order.append(v)
        for w in adj[v]:
            indeg[w] -= 1
            if indeg[w] == 0:
                heapq.heappush(heap, w)
    if len(order) < n:
        print(-1)
        return
    print(" ".join(map(str, order)))
    print("유일" if unique else "여러 개")


main()
