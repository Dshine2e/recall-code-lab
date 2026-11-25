import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    vals = list(map(int, data[2:2 + n * k]))
    prev = vals[0:k]
    for i in range(1, n):
        # 어제 값 중 가장 큰 것(번호 포함)과 두 번째로 큰 것
        b1, b1i, b2 = -1, -1, -1
        for j in range(k):
            v = prev[j]
            if v > b1:
                b2 = b1
                b1, b1i = v, j
            elif v > b2:
                b2 = v
        row = vals[i * k:(i + 1) * k]
        prev = [row[j] + (b2 if j == b1i else b1) for j in range(k)]
    print(max(prev))


main()
