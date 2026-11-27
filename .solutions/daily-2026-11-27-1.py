import sys


def main():
    data = sys.stdin.read().split()
    hh, mm = data[0].split(":")
    n, b = int(data[1]), int(data[2])
    lengths = list(map(int, data[3:3 + n]))
    cur = int(hh) * 60 + int(mm)
    out = []

    def fmt(t):
        t %= 1440
        return f"{t // 60:02d}:{t % 60:02d}"

    for a in lengths:
        out.append(f"{fmt(cur)}-{fmt(cur + a)}")
        cur += a + b
    print("\n".join(out))


main()
