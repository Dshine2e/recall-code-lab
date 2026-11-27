import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    total = {}
    for i in range(n):
        name = data[1 + 2 * i]
        qty = int(data[2 + 2 * i])
        total[name] = total.get(name, 0) + qty
    best_name, best = None, -1
    out = []
    for name, s in total.items():
        out.append(f"{name} {s}")
        if s > best:
            best, best_name = s, name
    out.append(best_name)
    print("\n".join(out))


main()
