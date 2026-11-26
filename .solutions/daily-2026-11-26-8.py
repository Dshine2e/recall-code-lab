import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    for i in range(m):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        adj[a].append(b)
        adj[b].append(a)
    color = [-1] * (n + 1)
    answer = 0
    for s in range(1, n + 1):
        if color[s] != -1:
            continue
        color[s] = 0
        cnt = [1, 0]
        q = deque([s])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    cnt[color[v]] += 1
                    q.append(v)
                elif color[v] == color[u]:
                    print("불가능")
                    return
        answer += min(cnt)
    print("가능")
    print(answer)


main()
