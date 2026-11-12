import sys

data = list(map(int, sys.stdin.read().split()))
n = data[0]
odds = [x for x in data[1:1 + n] if x % 2 != 0]
print(*odds if odds else [-1])
