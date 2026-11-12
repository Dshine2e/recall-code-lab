import sys


def main():
    data = sys.stdin.read().split()
    hh, mm = data[0].split(":")
    cur = int(hh) * 60 + int(mm)
    n = int(data[1])
    out = []
    for i in range(n):
        cur += int(data[2 + i])
        t = cur % 1440
        out.append("%02d:%02d" % (t // 60, t % 60))
    out.append(str(cur // 1440))
    sys.stdout.write("\n".join(out) + "\n")


main()
