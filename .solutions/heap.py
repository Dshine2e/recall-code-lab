import sys
import heapq

data = list(map(int, sys.stdin.read().split()))
n = data[0]
h = data[1:1 + n]
heapq.heapify(h)
out = []
while h:
    out.append(heapq.heappop(h))
print(*out)
