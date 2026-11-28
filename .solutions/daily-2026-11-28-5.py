import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, m, q = int(data[0]), int(data[1]), int(data[2])
    pos = 3
    P = [[0] * (m + 1) for _ in range(n + 1)]
    for r in range(1, n + 1):
        prev = P[r - 1]
        cur = P[r]
        run = 0
        for c in range(1, m + 1):
            v = int(data[pos]); pos += 1
            if (r + c) & 1:
                run -= v
            else:
                run += v
            cur[c] = prev[c] + run
    out = []
    for _ in range(q):
        r1 = int(data[pos]); c1 = int(data[pos + 1]); r2 = int(data[pos + 2]); c2 = int(data[pos + 3]); pos += 4
        out.append(P[r2][c2] - P[r1 - 1][c2] - P[r2][c1 - 1] + P[r1 - 1][c1 - 1])
    sys.stdout.write("\n".join(map(str, out)) + "\n")

main()
