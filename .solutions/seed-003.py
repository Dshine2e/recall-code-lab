import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    pos = 2
    pre = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        prev = pre[i - 1]
        cur = pre[i]
        s = 0
        for j in range(1, m + 1):
            s += int(data[pos])
            pos += 1
            cur[j] = prev[j] + s
    q = int(data[pos])
    pos += 1
    out = []
    for _ in range(q):
        r = int(data[pos]); c = int(data[pos + 1]); k = int(data[pos + 2])
        pos += 3
        r1 = max(1, r - k); r2 = min(n, r + k)
        c1 = max(1, c - k); c2 = min(m, c + k)
        a = pre[r2]; b = pre[r1 - 1]
        out.append(a[c2] - b[c2] - a[c1 - 1] + b[c1 - 1])
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
