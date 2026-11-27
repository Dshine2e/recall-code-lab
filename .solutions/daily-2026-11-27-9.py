import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    c = [0] + [int(x) for x in data[1:1 + n]]
    adj = [[] for _ in range(n + 1)]
    idx = 1 + n
    for _ in range(n - 1):
        u, v = int(data[idx]), int(data[idx + 1])
        idx += 2
        adj[u].append(v)
        adj[v].append(u)
    INF = 1 << 62
    parent = [0] * (n + 1)
    order = [1]
    parent[1] = -1
    for v in order:
        for w in adj[v]:
            if w != parent[v]:
                parent[w] = v
                order.append(w)
    put = [0] * (n + 1)      # 여기에 세움
    child = [0] * (n + 1)    # 안 세움, 자식이 지켜 줌
    up = [0] * (n + 1)       # 안 세움, 부모가 지켜야 함
    for v in reversed(order):
        s_put = c[v]
        s_free = 0
        extra = INF
        has = False
        for w in adj[v]:
            if w == parent[v]:
                continue
            a, b, d = put[w], child[w], up[w]
            s_put += min(a, b, d)
            if a <= b:
                s_free += a
                has = True
            else:
                s_free += b
                if a - b < extra:
                    extra = a - b
        put[v] = s_put
        up[v] = s_free
        if has:
            child[v] = s_free
        elif extra < INF:
            child[v] = s_free + extra
        else:
            child[v] = INF
    print(min(put[1], child[1]))


main()
