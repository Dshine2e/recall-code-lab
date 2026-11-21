import sys
from collections import deque
def main():
    data = sys.stdin.read().split()
    n = int(data[0]); s = data[1]
    dq = deque()
    for i in range(n, 0, -1):
        if dq:
            if s[i - 1] == 'R':
                dq.appendleft(dq.pop())
            else:
                dq.append(dq.popleft())
        dq.appendleft(i)
    print(" ".join(map(str, dq)))
main()
