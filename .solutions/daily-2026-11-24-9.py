import sys

def main():
    data = sys.stdin.buffer.read().split()
    pos = 0
    n, m, q = int(data[0]), int(data[1]), int(data[2])
    pos = 3
    edges = []
    for _ in range(m):
        edges.append((int(data[pos]) - 1, int(data[pos + 1]) - 1))
        pos += 2
    order = [int(x) - 1 for x in data[pos:pos + q]]
    broken = [False] * m
    for e in order:
        broken[e] = True

    parent = list(range(n))
    size = [1] * n

    def find(x):
        root = x
        while parent[root] != root:
            root = parent[root]
        while parent[x] != root:
            parent[x], x = root, parent[x]
        return root

    comps = n
    biggest = 1

    def union(a, b):
        nonlocal comps, biggest
        a, b = find(a), find(b)
        if a == b:
            return
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        comps -= 1
        if size[a] > biggest:
            biggest = size[a]

    for i in range(m):
        if not broken[i]:
            union(*edges[i])
    ans = [None] * q
    for j in range(q - 1, -1, -1):
        ans[j] = f"{comps} {biggest}"
        union(*edges[order[j]])
    sys.stdout.write("\n".join(ans) + "\n")

main()
