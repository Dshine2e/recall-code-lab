import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    mx = max(a)
    cnt = [0] * (mx + 1)
    for x in a:
        cnt[x] += 1
    res = [0] * (mx + 1)
    for v in range(1, mx + 1):
        c = cnt[v]
        if c:
            for m in range(v, mx + 1, v):
                res[m] += c
    print(" ".join(str(res[x] - 1) for x in a))

main()
