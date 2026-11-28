import sys

def main():
    data = sys.stdin.read().split()
    n, m = int(data[0]), int(data[1])
    g = data[2:2 + n]
    NEG = -1
    val = [[(-1 if ch == '#' else ord(ch) - 48) for ch in row] for row in g]
    # dp[r1][r2]: 걸음 수 s 에서 첫째가 r1 행, 둘째가 r2 행에 있을 때 최대 합(불가능하면 -1)
    dp = [[NEG] * n for _ in range(n)]
    dp[0][0] = val[0][0]
    for s in range(1, n + m - 1):
        nd = [[NEG] * n for _ in range(n)]
        lo = max(0, s - (m - 1))
        hi = min(n - 1, s)
        for r1 in range(lo, hi + 1):
            v1 = val[r1][s - r1]
            if v1 < 0:
                continue
            for r2 in range(r1, hi + 1):
                v2 = val[r2][s - r2]
                if v2 < 0:
                    continue
                best = NEG
                for a in (r1, r1 - 1):
                    if a < 0:
                        continue
                    row = dp[a]
                    for b in (r2, r2 - 1):
                        if b < 0:
                            continue
                        x = row[b] if a <= b else dp[b][a]
                        if x > best:
                            best = x
                if best < 0:
                    continue
                nd[r1][r2] = best + v1 + (v2 if r1 != r2 else 0)
        dp = nd
    print(dp[n - 1][n - 1])

main()
