n, k = map(int, input().split())
h = list(map(int, input().split()))
peaks = []
for i in range(n):
    if h[i] < k:
        continue
    if i > 0 and h[i] <= h[i - 1]:
        continue
    if i < n - 1 and h[i] <= h[i + 1]:
        continue
    peaks.append(i + 1)
print(len(peaks))
if peaks:
    print(*peaks)
