import sys

data = sys.stdin.read().split()
n, k = int(data[0]), int(data[1])
a = list(map(int, data[2:2 + n]))
cnt = 0
for i in range(n):
    for j in range(i + 1, n):
        if (a[i] + a[j]) % k == 0:
            cnt += 1
print(cnt)
