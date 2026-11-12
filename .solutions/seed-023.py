import sys


def main():
    data = sys.stdin.read().split()
    pos = 0
    n = int(data[pos]); pos += 1
    t = []
    for i in range(n):
        t.append([int(x) for x in data[pos:pos + n]])
        pos += n
    need = [0] * n  # need[j]: j번 별보다 먼저 봐야 하는 별들의 비트마스크
    for i in range(n):
        k = int(data[pos]); pos += 1
        for _ in range(k):
            need[i] |= 1 << (int(data[pos]) - 1)
            pos += 1

    INF = 1 << 62
    size = 1 << n
    dp = [[INF] * n for _ in range(size)]
    for i in range(n):
        if need[i] == 0:
            dp[1 << i][i] = 0
    for mask in range(1, size):
        row = dp[mask]
        nexts = [j for j in range(n) if not (mask >> j) & 1 and (need[j] & mask) == need[j]]
        if not nexts:
            continue
        for last in range(n):
            v = row[last]
            if v >= INF:
                continue
            tl = t[last]
            for j in nexts:
                nv = v + tl[j]
                target = dp[mask | (1 << j)]
                if nv < target[j]:
                    target[j] = nv
    best = min(dp[size - 1])
    print(best if best < INF else -1)


main()
