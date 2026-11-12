import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k, m = int(data[0]), int(data[1]), int(data[2])
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    comps = n
    idx = 3
    for _ in range(k):
        a = find(int(data[idx])); b = find(int(data[idx + 1]))
        idx += 2
        if a != b:
            parent[a] = b
            comps -= 1

    edges = []
    for _ in range(m):
        u = int(data[idx]); v = int(data[idx + 1]); w = int(data[idx + 2])
        idx += 3
        edges.append((w, u, v))
    edges.sort()

    total = 0
    biggest = 0
    for w, u, v in edges:
        if comps == 1:
            break
        a = find(u); b = find(v)
        if a != b:
            parent[a] = b
            comps -= 1
            total += w
            biggest = w

    if comps != 1:
        print(-1)
    else:
        print(total)
        print(biggest)


main()
