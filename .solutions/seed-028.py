import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k, cap = int(data[0]), int(data[1]), int(data[2])
    w = list(map(int, data[3:3 + n]))

    # 칸 수 제한만으로도 트럭이 모자라면 적재 한도와 상관없이 불가능
    if (n + cap - 1) // cap > k:
        print(-1)
        return

    def trucks_enough(limit):
        used = 1
        load = 0
        boxes = 0
        for x in w:
            if load + x > limit or boxes == cap:
                used += 1
                if used > k:
                    return False
                load = x
                boxes = 1
            else:
                load += x
                boxes += 1
        return True

    total = sum(w)
    lo = max(max(w), (total + k - 1) // k)  # 이보다 작으면 절대 불가능
    hi = total                               # 칸 수만 맞으면 항상 가능
    while lo < hi:
        mid = (lo + hi) // 2
        if trucks_enough(mid):
            hi = mid
        else:
            lo = mid + 1
    print(lo)


main()
