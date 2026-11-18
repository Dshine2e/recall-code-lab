import sys
from collections import deque


def main():
    data = sys.stdin.read().split()
    h, w = int(data[0]), int(data[1])
    grid = "".join(data[2:2 + h])
    n = h * w
    start = grid.index("A")
    goal = grid.index("B")
    # 상태 = 칸 * 4 + 방향 (0 위, 1 오른쪽, 2 아래, 3 왼쪽)
    step = [-w, 1, w, -1]
    INF = 1 << 30
    dist = [INF] * (n * 4)
    dq = deque()
    for d in range(4):
        dist[start * 4 + d] = 0
        dq.append(start * 4 + d)
    while dq:
        s = dq.popleft()
        c, d = divmod(s, 4)
        cur = dist[s]
        if c == goal:
            print(cur)
            return
        # 앞으로 한 칸 (비용 0)
        r, col = divmod(c, w)
        ok = (d == 0 and r > 0) or (d == 1 and col < w - 1) or (d == 2 and r < h - 1) or (d == 3 and col > 0)
        if ok:
            nc = c + step[d]
            if grid[nc] != "#":
                ns = nc * 4 + d
                if cur < dist[ns]:
                    dist[ns] = cur
                    dq.appendleft(ns)
        # 제자리에서 90도 회전 (덕트 칸이면 비용 0, 아니면 1)
        cost = 0 if grid[c] == "o" else 1
        for nd in ((d + 1) & 3, (d + 3) & 3):
            ns = c * 4 + nd
            if cur + cost < dist[ns]:
                dist[ns] = cur + cost
                if cost == 0:
                    dq.appendleft(ns)
                else:
                    dq.append(ns)
    print(-1)


main()
