import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    for i in range(m):
        u, v = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        adj[u].append(v)
        adj[v].append(u)
    seen = [False] * (n + 1)
    comps = trees = 0
    biggest = 0
    for s in range(1, n + 1):
        if seen[s]:
            continue
        comps += 1
        seen[s] = True
        stack = [s]
        verts = 0
        deg = 0
        while stack:
            u = stack.pop()
            verts += 1
            deg += len(adj[u])
            for v in adj[u]:
                if not seen[v]:
                    seen[v] = True
                    stack.append(v)
        if deg // 2 == verts - 1:
            trees += 1
        biggest = max(biggest, verts)
    print(comps, trees, biggest)

main()
