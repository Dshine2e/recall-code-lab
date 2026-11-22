import sys
from bisect import bisect_left


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    boxes = []
    for i in range(n):
        x, y = int(data[1 + 2 * i]), int(data[2 + 2 * i])
        if x > y:
            x, y = y, x
        boxes.append((x, -y))
    boxes.sort()
    tails = []
    for _, ny in boxes:
        y = -ny
        k = bisect_left(tails, y)
        if k == len(tails):
            tails.append(y)
        else:
            tails[k] = y
    print(len(tails))


main()
