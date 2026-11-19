import sys
from collections import deque

def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    pos = 2
    t = [0] * n
    p = [0] * n
    for i in range(n):
        t[i] = int(data[pos]); p[i] = int(data[pos + 1]); pos += 2
    ans = [0] * n
    q = deque(range(n))
    for j in range(1, m + 1):
        b, c = int(data[pos]), int(data[pos + 1]); pos += 2
        while c > 0 and q:
            i = q[0]
            if t[i] > b:
                break
            q.popleft()
            if t[i] + p[i] < b:
                continue
            ans[i] = j
            c -= 1
    print(" ".join(map(str, ans)))

main()
