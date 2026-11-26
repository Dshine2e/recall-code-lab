import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    s = list(map(int, data[2:2 + n]))
    score = [0] * n
    jumps = [0] * n
    score[0] = s[0]
    dq = deque([0])
    for i in range(1, n):
        while dq[0] < i - k:
            dq.popleft()
        j = dq[0]
        score[i] = score[j] + s[i]
        jumps[i] = jumps[j] + 1
        si, ji = score[i], jumps[i]
        # 점수가 크거나, 같으면 점프 수가 작은 쪽이 좋다
        while dq and (score[dq[-1]] < si or (score[dq[-1]] == si and jumps[dq[-1]] >= ji)):
            dq.pop()
        dq.append(i)
    print(score[n - 1], jumps[n - 1])


main()
