import sys


def main():
    data = sys.stdin.read().split()
    y = int(data[0])
    names = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    first = names.index(data[1])
    n = int(data[2])
    leap = (y % 4 == 0 and y % 100 != 0) or y % 400 == 0
    days = [31, 29 if leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    out = []
    pos = 3
    for _ in range(n):
        m, d = int(data[pos]), int(data[pos + 1])
        pos += 2
        k = sum(days[:m - 1]) + d
        out.append(f"{k} {names[(first + k - 1) % 7]}")
    print("\n".join(out))


main()
