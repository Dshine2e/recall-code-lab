import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    out = []
    for i in range(1, n + 1):
        x = int(data[i])
        if x == 0:
            out.append("0 0")
            continue
        digits = []
        ones = 0
        while x > 0:
            r = x % 2
            digits.append(str(r))
            ones += r
            x //= 2
        out.append("".join(reversed(digits)) + " " + str(ones))
    print("\n".join(out))


main()
