n = int(input())
rows = []
for r in range(1, 2 * n):
    k = n - abs(n - r)
    line = " " * (n - k)
    for j in range(1, k + 1):
        line += str(j % 10)
    for j in range(k - 1, 0, -1):
        line += str(j % 10)
    rows.append(line)
print("\n".join(rows))
