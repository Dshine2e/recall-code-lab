import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
best = 0
for i in range(1, n):
    if a[i] > a[best]:
        best = i
low = 0
for i in range(1, n):
    if a[i] <= a[low]:
        low = i
print(best + 1, a[best])
print(low + 1, a[low])
if a[best] == a[low]:
    print("고름")
else:
    print(abs(best - low))
