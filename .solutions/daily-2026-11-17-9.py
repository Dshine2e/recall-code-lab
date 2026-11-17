import sys

data = sys.stdin.buffer.read().split()
length, k = int(data[0]), int(data[1])
pts = [0] + sorted(map(int, data[2:2 + k])) + [length]
m = len(pts)
# dp[i][j]: pts[i]~pts[j] 조각 안의 표시를 모두 자르는 최소 비용
dp = [[0] * m for _ in range(m)]
for gap in range(2, m):
    for i in range(m - gap):
        j = i + gap
        row_i = dp[i]
        best = min(row_i[t] + dp[t][j] for t in range(i + 1, j))
        row_i[j] = best + pts[j] - pts[i]
print(dp[0][m - 1])
