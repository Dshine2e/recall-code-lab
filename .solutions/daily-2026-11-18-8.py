import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    pre = [0] * (n + 1)  # pre[i] = 1번 정류장에서 시계 방향으로 i+1번 정류장까지의 거리
    for i in range(n):
        pre[i + 1] = pre[i] + int(data[1 + i])
    total = pre[n]
    q = int(data[1 + n])
    pos = 2 + n
    out = []
    for _ in range(q):
        a, b = int(data[pos]), int(data[pos + 1])
        pos += 2
        if a > b:
            a, b = b, a
        cw = pre[b - 1] - pre[a - 1]
        out.append(min(cw, total - cw))
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
