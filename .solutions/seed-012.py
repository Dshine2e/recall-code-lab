import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    parent = list(range(n + 1))
    total = [0] + [int(x) for x in data[2:2 + n]]
    pos = 2 + n

    def find(x):
        root = x
        while parent[root] != root:
            root = parent[root]
        while parent[x] != root:
            parent[x], x = root, parent[x]
        return root

    out = []
    for _ in range(q):
        t = data[pos]
        if t == b"1":
            ra, rb = find(int(data[pos + 1])), find(int(data[pos + 2]))
            pos += 3
            if ra != rb:
                parent[rb] = ra
                total[ra] += total[rb]
        elif t == b"2":
            same = find(int(data[pos + 1])) == find(int(data[pos + 2]))
            pos += 3
            out.append("YES" if same else "NO")
        else:
            out.append(str(total[find(int(data[pos + 1]))]))
            pos += 2
    sys.stdout.write("\n".join(out) + "\n")


main()
