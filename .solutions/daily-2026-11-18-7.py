import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    # 위치 i 의 값 = (덮는 작업들의 c 합) * i + (덮는 작업들의 c*(1-l) 합)
    coef = [0] * (n + 2)
    const = [0] * (n + 2)
    pos = 2
    for _ in range(q):
        l, r, c = int(data[pos]), int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        coef[l] += c
        coef[r + 1] -= c
        b = c * (1 - l)
        const[l] += b
        const[r + 1] -= b
    out = []
    a = b = 0
    for i in range(1, n + 1):
        a += coef[i]
        b += const[i]
        out.append(a * i + b)
    sys.stdout.write(" ".join(map(str, out)) + "\n")


main()
