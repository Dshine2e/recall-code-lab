import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = data[1:1 + n]
    b = data[1 + n:1 + 2 * n]
    prev = 0
    pos = 0
    for i in range(n):
        c = int(b[i]) - int(a[i])
        d = c - prev
        if d > 0:
            pos += d
        prev = c
    if -prev > 0:
        pos += -prev
    print(pos)


main()
