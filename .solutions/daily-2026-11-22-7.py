import sys
def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    adj = [[] for _ in range(n + 1)]
    p = 1
    for _ in range(n - 1):
        u, v, w = int(data[p]), int(data[p + 1]), int(data[p + 2]); p += 3
        adj[u].append((v, w)); adj[v].append((u, w))
    def far(src):
        dist = [-1] * (n + 1)
        dist[src] = 0
        stack = [src]
        while stack:
            x = stack.pop()
            for y, w in adj[x]:
                if dist[y] < 0:
                    dist[y] = dist[x] + w
                    stack.append(y)
        best = max(range(1, n + 1), key=lambda i: dist[i])
        return best, dist[best]
    a, _ = far(1)
    _, d = far(a)
    print(d)
main()
