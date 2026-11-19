n, m, k = map(int, input().split())
g = [input().split() for _ in range(n)]
for _ in range(k % 4):
    r, c = len(g), len(g[0])
    g = [[g[r - 1 - i][j] for i in range(r)] for j in range(c)]
print(len(g), len(g[0]))
for row in g:
    print(" ".join(row))
