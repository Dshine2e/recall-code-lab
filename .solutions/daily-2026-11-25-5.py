import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        u, v = int(data[idx]), int(data[idx + 1])
        idx += 2
        adj[u].append(v)
        adj[v].append(u)
    seen = [False] * (n + 1)
    comps = 0
    same_pairs = 0
    for s in range(1, n + 1):
        if seen[s]:
            continue
        comps += 1
        seen[s] = True
        stack = [s]
        size = 0
        while stack:
            x = stack.pop()
            size += 1
            for y in adj[x]:
                if not seen[y]:
                    seen[y] = True
                    stack.append(y)
        same_pairs += size * (size - 1) // 2
    print(comps, n * (n - 1) // 2 - same_pairs)


main()
