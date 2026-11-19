import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    adj = [[] for _ in range(n + 1)]
    pos = 1
    for _ in range(n - 1):
        a, b, w = int(data[pos]), int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        adj[a].append((b, w))
        adj[b].append((a, w))
    LOG = max(1, n.bit_length())
    parent = [0] * (n + 1)
    depth = [0] * (n + 1)
    dist = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    # 반복 DFS 로 진입·탈출 시각 기록
    timer = 0
    parent[1] = 1
    stack = [(1, 0)]
    visited = [False] * (n + 1)
    while stack:
        v, state = stack.pop()
        if state == 0:
            visited[v] = True
            timer += 1
            tin[v] = timer
            stack.append((v, 1))
            for to, w in adj[v]:
                if not visited[to]:
                    parent[to] = v
                    depth[to] = depth[v] + 1
                    dist[to] = dist[v] + w
                    stack.append((to, 0))
        else:
            timer += 1
            tout[v] = timer
    up = [parent]
    for k in range(1, LOG):
        prev = up[-1]
        up.append([prev[prev[v]] for v in range(n + 1)])

    def is_anc(a, b):
        return tin[a] <= tin[b] and tout[b] <= tout[a]

    def lca(a, b):
        if is_anc(a, b):
            return a
        if is_anc(b, a):
            return b
        for k in range(LOG - 1, -1, -1):
            c = up[k][a]
            if not is_anc(c, b):
                a = c
        return up[0][a]

    q = int(data[pos])
    pos += 1
    out = []
    for _ in range(q):
        u, v, w = int(data[pos]), int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        l = lca(u, v)
        if is_anc(l, w) and (is_anc(w, u) or is_anc(w, v)):
            if is_anc(w, u):
                out.append(dist[u] - dist[w])
            else:
                out.append(dist[u] + dist[w] - 2 * dist[l])
        else:
            out.append(-1)
    sys.stdout.write("\n".join(map(str, out)) + "\n")

main()
