import sys

def main():
    data = list(map(int, sys.stdin.read().split()))
    n, m = data[0], data[1]
    order = list(range(1, n + 1))
    for i in range(m):
        l, r = data[2 + 2 * i], data[3 + 2 * i]
        order[l - 1:r] = order[l - 1:r][::-1]
    print(*order)

main()
