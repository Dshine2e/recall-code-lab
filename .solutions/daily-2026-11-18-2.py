import sys


def main():
    data = sys.stdin.read().split()
    n, lo, hi = int(data[0]), int(data[1]), int(data[2])
    accepted = []
    rejected = 0
    prev = None
    pos = 3
    for _ in range(n):
        code, w = data[pos], int(data[pos + 1])
        pos += 2
        if code == prev or w < lo or w > hi:
            rejected += 1
        else:
            accepted.append(code)
        prev = code
    print(" ".join(accepted) if accepted else "NONE")
    print(rejected)


main()
