import sys


def sums(items):
    res = [0]
    for x in items:
        res += [s + x for s in res]
    return res


def main():
    data = sys.stdin.buffer.read().split()
    n, budget = int(data[0]), int(data[1])
    p = [int(x) for x in data[2:2 + n]]
    left = sums(p[: n // 2])
    right = sums(p[n // 2:])
    left.sort()
    right.sort()
    # left 는 작은 것부터, right 는 큰 것부터 보는 투 포인터
    j = len(right) - 1
    count = 0
    best = 0
    for s in left:
        if s > budget:
            break
        while right[j] + s > budget:
            j -= 1
        count += j + 1
        t = s + right[j]
        if t > best:
            best = t
    print(count)
    print(best)


main()
