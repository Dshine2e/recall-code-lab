import random
random.seed(112504)
r = c = 1000
g = [['.'] * c for _ in range(r)]
for i in range(r):
    for j in range(c):
        if i % 4 == 0 and 3 <= j < c - 3 and random.random() < 0.3:
            g[i][j] = '#'
# 뱀 모양 벽으로 길게 돌아가게 만든다
for i in range(2, r - 1, 4):
    for j in range(c):
        g[i][j] = '#'
    g[i][c - 1 if (i // 4) % 2 == 0 else 0] = '.'
    g[i][c - 2 if (i // 4) % 2 == 0 else 1] = '.'
g[0][5] = 'S'
g[r - 1][c - 1] = 'E'
g[0][0] = '*'
g[1][0] = '*'
print(r, c)
print('\n'.join(''.join(row) for row in g))
