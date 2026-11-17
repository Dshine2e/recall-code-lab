import sys

data = sys.stdin.buffer.read().split()
n, lo, hi = int(data[0]), int(data[1]), int(data[2])
a = sorted(map(int, data[3:3 + n]))


def count_at_most(x):
    """합이 x 이하인 쌍(i<j)의 수"""
    i, j = 0, n - 1
    cnt = 0
    while i < j:
        if a[i] + a[j] <= x:
            cnt += j - i
            i += 1
        else:
            j -= 1
    return cnt


print(count_at_most(hi) - count_at_most(lo - 1))
