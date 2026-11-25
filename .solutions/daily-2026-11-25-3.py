r, c = map(int, input().split())
g = [input().strip() for _ in range(r)]
out = []
for i in range(r):
    row = []
    for j in range(c):
        if g[i][j] == '*':
            row.append('*')
            continue
        k = 0
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                if di == 0 and dj == 0:
                    continue
                ni, nj = i + di, j + dj
                if 0 <= ni < r and 0 <= nj < c and g[ni][nj] == '*':
                    k += 1
        row.append(str(k))
    out.append(''.join(row))
print('\n'.join(out))
