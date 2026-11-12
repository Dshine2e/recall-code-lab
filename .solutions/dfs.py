import sys

def main():
    data = list(map(int, sys.stdin.read().split()))
    n, m = data[0], data[1]
    g = [[] for _ in range(n)]
    for i in range(m):
        u, v = data[2 + 2 * i], data[3 + 2 * i]
        g[u].append(v)
        g[v].append(u)
    seen = [False] * n
    count = 0
    for r in range(n):
        if seen[r]:
            continue
        count += 1
        seen[r] = True
        stack = [r]
        while stack:
            u = stack.pop()
            for v in g[u]:
                if not seen[v]:
                    seen[v] = True
                    stack.append(v)
    print(count)

main()
