import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    diff = [0] * (n + 2)
    idx = 3
    for _ in range(m):
        l = int(data[idx]); r = int(data[idx + 1]); w = int(data[idx + 2])
        idx += 3
        diff[l] += w
        diff[r + 1] -= w
    cur = 0
    count = 0
    best = 0
    for i in range(1, n + 1):
        cur += diff[i]
        if cur >= k:
            count += 1
        if cur > best:
            best = cur
    sys.stdout.write("%d\n%d\n" % (count, best))


main()
