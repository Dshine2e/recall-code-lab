import sys

data = sys.stdin.read().split()
n = int(data[0])
h = [int(x) for x in data[1:1 + n]]
best_up, up_day = None, -1
best_down, down_day = None, -1
for i in range(1, n):
    d = h[i] - h[i - 1]
    day = i + 1
    if best_up is None or d > best_up:
        best_up, up_day = d, day
    if best_down is None or d <= best_down:
        best_down, down_day = d, day
print(best_up, up_day)
print(best_down, down_day)
