import sys

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    s = data[1]
    dx = {"U": 0, "D": 0, "L": -1, "R": 1}
    dy = {"U": 1, "D": -1, "L": 0, "R": 0}
    x = y = 0
    seen = {(0, 0)}
    first = None
    for k in range(n):
        c = s[k]
        x += dx[c]
        y += dy[c]
        if (x, y) in seen:
            if first is None:
                first = (k + 1, x, y)
        else:
            seen.add((x, y))
    print(*first) if first else print(-1)
    print(len(seen))

main()
