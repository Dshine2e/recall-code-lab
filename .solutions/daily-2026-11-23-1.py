import sys
data = sys.stdin.read().split()
h0, n = int(data[0]), int(data[1])
d = list(map(int, data[2:2 + n]))
cur = h0
up = down = 0
best = h0
best_i = 0
for i, x in enumerate(d, 1):
    if x > 0:
        up += x
    else:
        down -= x
    cur += x
    if cur > best:
        best = cur
        best_i = i
print(up, down)
print(best, best_i)
print(cur)
