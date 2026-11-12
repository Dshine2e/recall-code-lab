import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    remain = [int(x) for x in data[2:2 + n]]
    finish = [0] * n
    dq = deque(range(n))
    now = 0
    while dq:
        i = dq.popleft()
        if remain[i] <= q:
            now += remain[i]
            finish[i] = now
        else:
            now += q
            remain[i] -= q
            dq.append(i)
    sys.stdout.write("\n".join(map(str, finish)) + "\n")


main()
