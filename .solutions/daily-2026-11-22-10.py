import sys
def main():
    data = sys.stdin.buffer.read().split()
    g, B = int(data[0]), int(data[1])
    p = 2
    NEG = -(1 << 60)
    dp = [0] * (B + 1)  # dp[b]: 지금까지의 그룹에서 하나씩 골라 비용 합이 b 이하일 때 최대 만족도
    for _ in range(g):
        k = int(data[p]); p += 1
        ndp = [NEG] * (B + 1)
        for _ in range(k):
            c, v = int(data[p]), int(data[p + 1]); p += 2
            if c > B:
                continue
            shifted = [NEG] * c + [x + v for x in dp[:B + 1 - c]]
            ndp = [a if a >= s else s for a, s in zip(ndp, shifted)]
        dp = ndp
    print(dp[B] if dp[B] >= 0 else -1)
main()
