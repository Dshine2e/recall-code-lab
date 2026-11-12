import sys
from bisect import bisect_left


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    pots = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)]
    # 지름 오름차순, 지름이 같으면 높이 내림차순: 같은 지름끼리는 한 줄에 둘 이상 들어가지 않게
    pots.sort(key=lambda p: (p[0], -p[1]))
    tails = []
    for _, h in pots:
        k = bisect_left(tails, h)
        if k == len(tails):
            tails.append(h)
        else:
            tails[k] = h
    print(len(tails))


main()
