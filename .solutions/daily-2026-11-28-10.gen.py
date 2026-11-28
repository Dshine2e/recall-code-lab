import random
random.seed(1128010)
n = m = 100
rows = []
for r in range(n):
    row = []
    for c in range(m):
        if random.random() < 0.15:
            row.append('#')
        else:
            row.append(str(random.randint(0, 9)))
    rows.append(row)
rows[0][0] = '5'
rows[n - 1][m - 1] = '7'
# 막힌 칸이 있어도 길 하나는 보장: 맨 위 줄과 맨 오른쪽 열은 비움
for c in range(m):
    if rows[0][c] == '#':
        rows[0][c] = '1'
for r in range(n):
    if rows[r][m - 1] == '#':
        rows[r][m - 1] = '1'
print(n, m)
for row in rows:
    print("".join(row))
