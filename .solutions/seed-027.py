import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    dq = deque()  # 값이 줄어드는 순서로 인덱스를 보관. 맨 앞이 현재 창의 최댓값
    best = None
    best_start = 0
    for i, v in enumerate(a):
        while dq and a[dq[-1]] <= v:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            m = a[dq[0]]
            if best is None or m < best:  # 같으면 더 이른 시작을 유지
                best = m
                best_start = i - k + 2      # 1-based 시작 시각
    print(best, best_start)


main()
