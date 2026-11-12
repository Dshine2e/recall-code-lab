import sys


def main():
    lines = sys.stdin.read().split()
    r, c = int(lines[0]), int(lines[1])
    grid = lines[2:2 + r]
    cmds = lines[3 + r] if len(lines) > 3 + r else ""
    for i in range(r):
        j = grid[i].find("S")
        if j != -1:
            y, x = i, j
    moves = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}
    seen = {(y, x)}
    for ch in cmds:
        dy, dx = moves[ch]
        ny, nx = y + dy, x + dx
        if 0 <= ny < r and 0 <= nx < c and grid[ny][nx] != "#":
            y, x = ny, nx
            seen.add((y, x))
    print(y + 1, x + 1)
    print(len(seen))


main()
