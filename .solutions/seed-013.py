import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    temps = [int(x) for x in data[1:1 + n]]
    best = temps[0]
    first = last = 1
    for i in range(1, n):
        t = temps[i]
        if t > best:
            best = t
            first = last = i + 1
        elif t == best:
            last = i + 1
    print(best, first, last)


main()
