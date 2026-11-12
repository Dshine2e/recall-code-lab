import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    a = set(data[2:2 + n])
    b = set(data[2 + n:2 + n + m])
    both = len(a & b)
    union = len(a | b)
    only_a = len(a - b)
    only_b = len(b - a)
    print(both, union, only_a, only_b)


main()
