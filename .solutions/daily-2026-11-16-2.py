import sys
from bisect import bisect_left, bisect_right

def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    w = sorted(map(int, data[2:2 + n]))
    out = []
    idx = 2 + n
    for _ in range(q):
        l, r = int(data[idx]), int(data[idx + 1])
        idx += 2
        out.append(bisect_right(w, r) - bisect_left(w, l))
    sys.stdout.write("\n".join(map(str, out)) + "\n")

main()
