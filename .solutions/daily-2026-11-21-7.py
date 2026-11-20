import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    ev = []
    for i in range(n):
        s, e = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        ev.append((s, 1))
        ev.append((e, -1))
    ev.sort()
    cur = 0
    total = 0
    prev = 0
    for x, d in ev:
        if cur >= k:
            total += x - prev
        cur += d
        prev = x
    print(total)


main()
