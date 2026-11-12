import sys

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n, s = data[0], data[1]
    a = data[2:2 + n]
    count = 0
    total = 0
    left = 0
    for right in range(n):
        total += a[right]
        while total > s:
            total -= a[left]
            left += 1
        if total == s:
            count += 1
    print(count)

main()
