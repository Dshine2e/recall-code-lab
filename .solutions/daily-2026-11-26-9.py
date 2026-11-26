import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    vals = sorted(set(a))

    def ok(x):
        # x 이상이면 +1, 미만이면 -1. 길이 k 이상 구간의 합이 양수면 중앙값 >= x
        pre = [0] * (n + 1)
        s = 0
        for i in range(n):
            s += 1 if a[i] >= x else -1
            pre[i + 1] = s
        mn = 10**9
        for r in range(k, n + 1):
            p = pre[r - k]
            if p < mn:
                mn = p
            if pre[r] - mn > 0:
                return True
        return False

    lo, hi = 0, len(vals) - 1  # vals[lo] 는 항상 가능
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if ok(vals[mid]):
            lo = mid
        else:
            hi = mid - 1
    print(vals[lo])


main()
