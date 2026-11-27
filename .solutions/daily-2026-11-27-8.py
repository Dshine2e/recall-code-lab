import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    t = [0] + [int(x) for x in data[1:1 + n]]
    children = [[] for _ in range(n + 1)]
    for i in range(2, n + 1):
        children[int(data[n - 1 + i])].append(i)
    ans = [0] * (n + 1)
    stack = [1]
    while stack:
        v = stack.pop()
        base = ans[v] + t[v]
        for c in children[v]:
            ans[c] = base
            stack.append(c)
    sys.stdout.write(" ".join(map(str, ans[1:])) + "\n")


main()
