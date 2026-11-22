import sys
from itertools import accumulate


def main():
    data = sys.stdin.buffer.read().split()
    n, m, q = int(data[0]), int(data[1]), int(data[2])
    pos = 3
    # P[i][j] = 1..i 행, 1..j 열의 합 (0 행·0 열은 0)
    P = [[0] * (m + 1)]
    prev = P[0]
    for i in range(n):
        row = list(accumulate(map(int, data[pos:pos + m]), initial=0))
        pos += m
        cur = [a + b for a, b in zip(row, prev)]
        P.append(cur)
        prev = cur

    def rect(r1, c1, r2, c2):
        return P[r2][c2] - P[r1 - 1][c2] - P[r2][c1 - 1] + P[r1 - 1][c1 - 1]

    out = []
    for _ in range(q):
        r1, c1, r2, c2, t = (int(x) for x in data[pos:pos + 5])
        pos += 5
        total = rect(r1, c1, r2, c2)
        a, b, c, d = r1 + t, c1 + t, r2 - t, c2 - t
        if a <= c and b <= d:
            total -= rect(a, b, c, d)
        out.append(total)
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
