import sys
from functools import cmp_to_key


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    jobs = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)]

    def cmp(a, b):
        x, y = a[0] * b[1], b[0] * a[1]
        return -1 if x < y else (1 if x > y else 0)

    jobs.sort(key=cmp_to_key(cmp))
    now = 0
    total = 0
    for t, w in jobs:
        now += t
        total += now * w
    print(total)


main()
