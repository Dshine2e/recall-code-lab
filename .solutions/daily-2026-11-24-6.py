import sys
from collections import deque

def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    lines = [deque() for _ in range(k)]  # 줄마다 끝나는 시각
    out = []
    for i in range(n):
        a, s = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        for q in lines:
            while q and q[0] <= a:
                q.popleft()
        best = 0
        for j in range(1, k):
            if len(lines[j]) < len(lines[best]):
                best = j
        q = lines[best]
        start = max(a, q[-1]) if q else a
        q.append(start + s)
        out.append(f"{best + 1} {start + s}")
    sys.stdout.write("\n".join(out) + "\n")

main()
