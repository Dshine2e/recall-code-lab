import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    s = data[2]
    # P[i] = 앞 i글자에서 알파벳마다 홀수 번 나왔는지를 비트로 모은 값
    P = [0] * (n + 1)
    x = 0
    for i, ch in enumerate(s, 1):
        x ^= 1 << (ch - 97)
        P[i] = x
    out = []
    pos = 3
    for _ in range(q):
        l, r = int(data[pos]), int(data[pos + 1])
        pos += 2
        odd = bin(P[r] ^ P[l - 1]).count("1")
        out.append(odd // 2)
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
