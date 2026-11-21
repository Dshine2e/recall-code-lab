import sys
def main():
    data = sys.stdin.read().split()
    n, W = int(data[0]), int(data[1])
    w = list(map(int, data[2:2 + n]))
    full = (1 << n) - 1
    INF = (n + 5, 0)
    trips = [n + 5] * (1 << n)
    load = [0] * (1 << n)
    trips[0] = 1
    for mask in range(1 << n):
        t, l = trips[mask], load[mask]
        for i in range(n):
            bit = 1 << i
            if mask & bit:
                continue
            if l + w[i] <= W:
                nt, nl = t, l + w[i]
            else:
                nt, nl = t + 1, w[i]
            nm = mask | bit
            if nt < trips[nm] or (nt == trips[nm] and nl < load[nm]):
                trips[nm], load[nm] = nt, nl
    print(trips[full])
main()
