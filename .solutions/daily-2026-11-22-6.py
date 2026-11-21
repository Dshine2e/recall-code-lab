import sys
def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    a = [(int(data[2 + 2 * i]), int(data[3 + 2 * i])) for i in range(n)]
    off = 2 + 2 * n
    b = [(int(data[off + 2 * j]), int(data[off + 1 + 2 * j])) for j in range(m)]
    i = j = 0
    cnt = total = 0
    best = None
    while i < n and j < m:
        lo = max(a[i][0], b[j][0]); hi = min(a[i][1], b[j][1])
        if lo < hi:
            cnt += 1; total += hi - lo
            if best is None or hi - lo > best[1] - best[0]:
                best = (lo, hi)
        if a[i][1] < b[j][1]:
            i += 1
        else:
            j += 1
    print(cnt, total)
    print(f"{best[0]} {best[1]}" if best else -1)
main()
