import sys

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    a = sorted(int(x) for x in data[1:1 + n])
    squares = {k * k for k in range(1, 8)}
    used = [False] * n
    path = []
    count = 0
    first = None

    def go():
        nonlocal count, first
        if len(path) == n:
            count += 1
            if first is None:
                first = path[:]
            return
        prev = None
        for i in range(n):
            if used[i] or a[i] == prev:
                continue
            if path and path[-1] + a[i] not in squares:
                continue
            prev = a[i]
            used[i] = True
            path.append(a[i])
            go()
            path.pop()
            used[i] = False

    go()
    print(count)
    print(" ".join(map(str, first)) if first else -1)

main()
