import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    codes = data[1:1 + n]
    have = set(codes)
    cnt = 0
    for w in codes:
        for L in range(1, len(w)):
            if w[:L] in have:
                cnt += 1
                break
    print(cnt)


main()
