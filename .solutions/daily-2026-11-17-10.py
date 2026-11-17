import sys

data = sys.stdin.buffer.read().split()
n, m = int(data[0]), int(data[1])
vals = list(map(int, data[2:2 + n * m]))
NEG = float("-inf")
# a[j]: 방패를 아직 안 쓴 최댓값, b[j]: 방패를 쓴 최댓값 (윗줄 값을 덮어쓰며 한 줄씩)
a = [NEG] * m
b = [NEG] * m
for i in range(n):
    row = vals[i * m:(i + 1) * m]
    for j in range(m):
        v = row[j]
        if i == 0 and j == 0:
            a[0] = v
            b[0] = 0
            continue
        pa = a[j]
        pb = b[j]
        if j > 0:
            if a[j - 1] > pa:
                pa = a[j - 1]
            if b[j - 1] > pb:
                pb = b[j - 1]
        a[j] = pa + v
        nb = pb + v
        if pa > nb:
            nb = pa
        b[j] = nb
print(max(a[m - 1], b[m - 1]))
