import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    shows = []
    for i in range(n):
        s = int(data[2 + 2 * i])
        e = int(data[3 + 2 * i])
        shows.append((e, s))
    shows.sort()
    count = 0
    ready = None  # 다음 공연을 시작할 수 있는 가장 이른 시각
    for e, s in shows:
        if ready is None or s >= ready:
            count += 1
            ready = e + k
    print(count)


main()
