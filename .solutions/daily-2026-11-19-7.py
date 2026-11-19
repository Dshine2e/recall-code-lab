import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    ls = list(map(int, data[2:2 + 2 * n:2]))
    rs = list(map(int, data[3:3 + 2 * n:2]))
    xs = sorted(set(ls) | set(rs))
    idx = {x: i for i, x in enumerate(xs)}
    d = [0] * (len(xs) + 1)
    for l, r in zip(ls, rs):
        d[idx[l]] += 1
        d[idx[r]] -= 1
    cur = 0
    total = 0
    for i in range(len(xs) - 1):
        cur += d[i]
        if cur == k:
            total += xs[i + 1] - xs[i]
    print(total)

main()
