import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    last = {}
    best_d = -1
    best_v = -1
    for i in range(n):
        v = int(data[1 + i])
        if v in last:
            d = i - last[v]
            if best_d == -1 or d < best_d or (d == best_d and v < best_v):
                best_d, best_v = d, v
        last[v] = i
    if best_d == -1:
        print(-1)
    else:
        print(best_d, best_v)


main()
