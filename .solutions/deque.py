import sys
from collections import deque

n, k = map(int, sys.stdin.read().split())
d = deque(range(1, n + 1))
d.rotate(k)
print(*d)
