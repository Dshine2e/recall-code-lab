import sys
from math import gcd
def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0]); a = list(map(int, data[1:1 + n]))
    pre = [0] * (n + 1); suf = [0] * (n + 2)
    for i in range(n):
        pre[i + 1] = gcd(pre[i], a[i])
    for i in range(n - 1, -1, -1):
        suf[i] = gcd(suf[i + 1], a[i])
    best, idx = -1, -1
    for i in range(n):
        g = gcd(pre[i], suf[i + 1])
        if g > best:
            best, idx = g, i + 1
    print(best, idx)
main()
