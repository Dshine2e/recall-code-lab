import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    v = list(map(int, data[1:1 + n]))
    # f[l] = 길이 length 인 구간 [l, l+length-1] 을 (n-length+1)일째부터 팔 때 최대 수익
    f = [x * n for x in v]
    for length in range(2, n + 1):
        day = n - length + 1
        g = [0] * (n - length + 1)
        for l in range(n - length + 1):
            a = v[l] * day + f[l + 1]
            b = v[l + length - 1] * day + f[l]
            g[l] = a if a > b else b
        f = g
    print(f[0])

main()
