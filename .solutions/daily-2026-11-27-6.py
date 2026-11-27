import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, d = int(data[0]), int(data[1])
    a = sorted(map(int, data[2:2 + n]))
    left = 0
    ans = 0
    for right in range(n):
        x = a[right]
        while x - a[left] > d:
            left += 1
        ans += right - left
    print(ans)


main()
