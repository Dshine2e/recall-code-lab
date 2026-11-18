import sys


def main():
    n, k = map(int, sys.stdin.read().split())
    x = n
    steps = 0
    while str(x) != str(x)[::-1]:
        if steps == k:
            print(-1)
            return
        x += int(str(x)[::-1])
        steps += 1
    print(steps, x)


main()
