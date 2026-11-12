import sys


def main():
    data = sys.stdin.buffer.read().split()
    r, c = int(data[0]), int(data[1])
    grid = b"".join(data[2:2 + r])
    total = r * c
    seen = bytearray(total)
    count = 0
    best = 0
    for start in range(total):
        if grid[start] != 35 or seen[start]:  # 35 == '#'
            continue
        count += 1
        seen[start] = 1
        stack = [start]
        size = 0
        while stack:
            cur = stack.pop()
            size += 1
            row, col = divmod(cur, c)
            if row > 0:
                nxt = cur - c
                if grid[nxt] == 35 and not seen[nxt]:
                    seen[nxt] = 1
                    stack.append(nxt)
            if row < r - 1:
                nxt = cur + c
                if grid[nxt] == 35 and not seen[nxt]:
                    seen[nxt] = 1
                    stack.append(nxt)
            if col > 0:
                nxt = cur - 1
                if grid[nxt] == 35 and not seen[nxt]:
                    seen[nxt] = 1
                    stack.append(nxt)
            if col < c - 1:
                nxt = cur + 1
                if grid[nxt] == 35 and not seen[nxt]:
                    seen[nxt] = 1
                    stack.append(nxt)
        if size > best:
            best = size
    print(count, best)


main()
