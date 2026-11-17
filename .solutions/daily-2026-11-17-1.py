import sys

data = sys.stdin.read().split()
n, g = int(data[0]), int(data[1])
pages = list(map(int, data[2:2 + n]))
total = 0
reached = -1
for day, p in enumerate(pages, 1):
    total += p
    if reached == -1 and total >= g:
        reached = day
print(total)
print(reached)
