import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    total = {}
    order = []
    for i in range(n):
        name = data[1 + 2 * i]
        qty = int(data[2 + 2 * i])
        if name not in total:
            total[name] = 0
            order.append(name)
        total[name] += qty
    print("\n".join(f"{name} {total[name]}" for name in order))


main()
