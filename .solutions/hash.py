import sys
from collections import Counter

data = sys.stdin.read().split()
n = int(data[0])
c = Counter(data[1:1 + n])
print(min(c, key=lambda w: (-c[w], w)))
