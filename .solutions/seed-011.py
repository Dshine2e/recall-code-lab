import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, cap = int(data[0]), int(data[1])
    items = [(int(data[2 + 2 * i]), int(data[3 + 2 * i])) for i in range(n)]
    total = sum(v for _, v in items)
    inf = float("inf")
    # best[x] = 점수 합이 정확히 x일 때 필요한 최소 무게
    best = [0] + [inf] * total
    reach = 0
    for w, v in items:
        reach += v
        old = best[:reach + 1 - v]
        tail = best[v:reach + 1]
        best[v:reach + 1] = [a if a <= b + w else b + w for a, b in zip(tail, old)]
    answer = 0
    for x in range(total, -1, -1):
        if best[x] <= cap:
            answer = x
            break
    print(answer)


main()
