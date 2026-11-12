import sys


def main():
    data = sys.stdin.buffer.read().split()
    r, c = int(data[0]), int(data[1])
    cells = b"".join(data[2:2 + r])
    total = r * c
    dist = [-1] * total
    queue = []
    for i in range(total):
        if cells[i] == 69:  # 'E'
            dist[i] = 0
            queue.append(i)
    wall = 35  # '#'
    head = 0
    while head < len(queue):
        cur = queue[head]
        head += 1
        nd = dist[cur] + 1
        y, x = divmod(cur, c)
        if y > 0:
            nxt = cur - c
            if dist[nxt] == -1 and cells[nxt] != wall:
                dist[nxt] = nd
                queue.append(nxt)
        if y < r - 1:
            nxt = cur + c
            if dist[nxt] == -1 and cells[nxt] != wall:
                dist[nxt] = nd
                queue.append(nxt)
        if x > 0:
            nxt = cur - 1
            if dist[nxt] == -1 and cells[nxt] != wall:
                dist[nxt] = nd
                queue.append(nxt)
        if x < c - 1:
            nxt = cur + 1
            if dist[nxt] == -1 and cells[nxt] != wall:
                dist[nxt] = nd
                queue.append(nxt)
    s = 0
    unreachable = 0
    for i in range(total):
        if cells[i] == 46:  # '.'
            if dist[i] == -1:
                unreachable += 1
            else:
                s += dist[i]
    print(s)
    print(unreachable)


main()
