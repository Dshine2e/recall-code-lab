import sys

data = list(map(int, sys.stdin.read().split()))
n = data[0]
pairs = [(data[1 + 2 * i], data[2 + 2 * i]) for i in range(n)]
pairs.sort(key=lambda p: (p[0], -p[1]))
print("\n".join(f"{a} {b}" for a, b in pairs))
