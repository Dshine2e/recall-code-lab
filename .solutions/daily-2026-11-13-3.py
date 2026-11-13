import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = [0] + [int(x) for x in data[1:1 + n]]
    children = [[] for _ in range(n + 1)]
    for i in range(2, n + 1):
        p = int(data[1 + n + (i - 2)])
        children[p].append(i)
    order = [1]
    for v in order:
        order.extend(children[v])
    take = [0] * (n + 1)
    skip = [0] * (n + 1)
    for v in reversed(order):
        t = a[v]
        s = 0
        for c in children[v]:
            t += skip[c]
            s += max(take[c], skip[c])
        take[v] = t
        skip[v] = s
    print(max(take[1], skip[1]))


main()
