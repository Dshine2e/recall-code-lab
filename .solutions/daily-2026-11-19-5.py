import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = data[2:2 + n]
    cnt = {}
    kinds = 0
    best, start = -1, 0
    for i in range(n):
        x = a[i]
        c = cnt.get(x, 0)
        if c == 0:
            kinds += 1
        cnt[x] = c + 1
        if i >= k:
            y = a[i - k]
            cnt[y] -= 1
            if cnt[y] == 0:
                kinds -= 1
        if i >= k - 1 and kinds > best:
            best, start = kinds, i - k + 2
    print(best, start)

main()
