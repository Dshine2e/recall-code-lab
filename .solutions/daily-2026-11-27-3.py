import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    rec = sorted(map(int, data[1:1 + n]), reverse=True)
    groups = []
    for x in rec:
        if groups and groups[-1][0] == x:
            groups[-1][1] += 1
        elif len(groups) < 3:
            groups.append([x, 1])
        else:
            break
    names = ["GOLD", "SILVER", "BRONZE"]
    print("\n".join(f"{names[i]} {v} {c}" for i, (v, c) in enumerate(groups)))


main()
