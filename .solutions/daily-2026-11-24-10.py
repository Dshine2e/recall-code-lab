import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    xs = [0] * n
    ys = [0] * n
    best = [0] * n  # 지금까지 만든 망에 붙이는 가장 싼 비용(처음엔 위성 비용)
    for i in range(n):
        xs[i] = int(data[1 + 3 * i])
        ys[i] = int(data[2 + 3 * i])
        best[i] = int(data[3 + 3 * i])
    left = list(range(n))
    total = 0
    while left:
        k = min(range(len(left)), key=lambda t: best[left[t]])
        v = left[k]
        left[k] = left[-1]
        left.pop()
        total += best[v]
        vx, vy = xs[v], ys[v]
        for u in left:
            d = abs(xs[u] - vx) + abs(ys[u] - vy)
            if d < best[u]:
                best[u] = d
    print(total)

main()
