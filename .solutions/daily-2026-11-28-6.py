import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    d = [0] * (n + 2)
    pos = 3
    for _ in range(m):
        l = int(data[pos]); r = int(data[pos + 1]); pos += 2
        if l <= r:
            d[l] += 1
            d[r + 1] -= 1
        else:
            d[l] += 1
            d[n + 1] -= 1
            d[1] += 1
            d[r + 1] -= 1
    cur = 0
    best = 0
    cnt = 0
    for i in range(1, n + 1):
        cur += d[i]
        if cur > best:
            best = cur
        if cur >= k:
            cnt += 1
    print(best)
    print(cnt)

main()
