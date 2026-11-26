import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    people = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(2 * n)]
    people.sort(key=lambda p: p[0] - p[1])
    total = sum(a for a, _ in people[:n]) + sum(b for _, b in people[n:])
    print(total)


main()
