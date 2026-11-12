import sys
from bisect import bisect_left

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    a = data[1:1 + n]
    q = data[1 + n]
    out = []
    for x in data[2 + n:2 + n + q]:
        i = bisect_left(a, x)
        out.append(i + 1 if i < n and a[i] == x else -1)
    sys.stdout.write(" ".join(map(str, out)) + "\n")

main()
