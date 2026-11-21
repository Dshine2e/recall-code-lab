import sys
from bisect import bisect_right
def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    start = [0] * n
    acc = 0
    for i in range(n):
        start[i] = acc
        acc += int(data[2 + i])
    total = acc
    out = []
    for j in range(q):
        t = int(data[2 + n + j]) % total
        i = bisect_right(start, t) - 1
        out.append(f"{i + 1} {t - start[i]}")
    sys.stdout.write("\n".join(out) + "\n")
main()
