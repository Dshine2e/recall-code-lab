import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    h = list(map(int, data[1:1 + n]))
    order = sorted(range(1, n + 1), key=lambda i: (h[i - 1], i))
    same = sum(1 for pos, num in enumerate(order, 1) if pos == num)
    print(" ".join(map(str, order)))
    print(same)


main()
