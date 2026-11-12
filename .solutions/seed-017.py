import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    t = [0] + [int(x) for x in data[2:2 + n]]
    adj = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)
    pos = 2 + n
    for _ in range(m):
        a = int(data[pos])
        b = int(data[pos + 1])
        pos += 2
        adj[a].append(b)
        indeg[b] += 1

    order = [v for v in range(1, n + 1) if indeg[v] == 0]
    start = [0] * (n + 1)
    head = 0
    while head < len(order):
        u = order[head]
        head += 1
        fin = start[u] + t[u]
        for v in adj[u]:
            if start[v] < fin:
                start[v] = fin
            indeg[v] -= 1
            if indeg[v] == 0:
                order.append(v)
    if len(order) < n:
        print(-1)
        return

    total = max(start[v] + t[v] for v in range(1, n + 1))
    tail = [0] * (n + 1)  # 작업 u 를 시작한 뒤 모든 일이 끝나기까지 걸리는 가장 긴 시간
    for u in reversed(order):
        best = 0
        for v in adj[u]:
            if tail[v] > best:
                best = tail[v]
        tail[u] = t[u] + best
    crit = [v for v in range(1, n + 1) if start[v] + tail[v] == total]
    sys.stdout.write(f"{total}\n{len(crit)}\n{' '.join(map(str, crit))}\n")


main()
