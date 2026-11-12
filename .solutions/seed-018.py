import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    base = [0] * (n + 1)
    acc = 0
    for i in range(1, n + 1):
        acc += int(data[1 + i])
        base[i] = acc
    # 구간 더하기·구간 합: 펜윅 두 개(f1: 더한 값, f2: 보정값)
    f1 = [0] * (n + 1)
    f2 = [0] * (n + 1)
    out = []
    pos = 2 + n
    for _ in range(q):
        if data[pos] == b"1":
            l = int(data[pos + 1])
            r = int(data[pos + 2])
            x = int(data[pos + 3])
            pos += 4
            i = l
            v1 = x
            v2 = x * (l - 1)
            while i <= n:
                f1[i] += v1
                f2[i] += v2
                i += i & -i
            i = r + 1
            v2 = x * r
            while i <= n:
                f1[i] -= v1
                f2[i] -= v2
                i += i & -i
        else:
            l = int(data[pos + 1])
            r = int(data[pos + 2])
            pos += 3
            s1 = s2 = 0
            i = r
            while i > 0:
                s1 += f1[i]
                s2 += f2[i]
                i -= i & -i
            res = base[r] + s1 * r - s2
            s1 = s2 = 0
            i = l - 1
            while i > 0:
                s1 += f1[i]
                s2 += f2[i]
                i -= i & -i
            res -= base[l - 1] + s1 * (l - 1) - s2
            out.append(res)
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
