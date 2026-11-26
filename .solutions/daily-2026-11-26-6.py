import sys


def main():
    data = sys.stdin.buffer.read().split()
    length, n = int(data[0]), int(data[1])
    iv = sorted((int(data[2 + 2 * i]), int(data[3 + 2 * i])) for i in range(n))
    blocks = []
    for s, e in iv:
        if blocks and s <= blocks[-1][1]:
            if e > blocks[-1][1]:
                blocks[-1][1] = e
        else:
            blocks.append([s, e])
    covered = sum(e - s for s, e in blocks)
    best = 0
    prev = 0
    for s, e in blocks:
        best = max(best, s - prev)
        prev = e
    best = max(best, length - prev)
    print(len(blocks))
    print(covered)
    print(best)


main()
