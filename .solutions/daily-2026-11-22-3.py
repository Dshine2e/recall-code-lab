import sys
DIG = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    out = []
    for i in range(n):
        b, s, c = int(data[1 + 3 * i]), data[2 + 3 * i], int(data[3 + 3 * i])
        v = 0
        for ch in s:
            v = v * b + DIG.index(ch)
        if v == 0:
            out.append("0")
            continue
        r = []
        while v > 0:
            r.append(DIG[v % c])
            v //= c
        out.append("".join(reversed(r)))
    print("\n".join(out))
main()
