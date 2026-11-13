import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    events = []
    for i in range(n):
        s = int(data[1 + 2 * i])
        e = int(data[2 + 2 * i])
        events.append((s, 1))
        events.append((e, -1))
    # 같은 시각이면 나가는(-1) 이벤트를 먼저 처리
    events.sort()
    cur = 0
    best = 0
    best_t = 0
    for t, d in events:
        cur += d
        if cur > best:
            best = cur
            best_t = t
    print(best, best_t)


main()
