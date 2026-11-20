import sys

lines = sys.stdin.read().split("\n")
ca, cb, n = map(int, lines[0].split())
cap = {"A": ca, "B": cb}
cur = {"A": 0, "B": 0}
used = 0
for line in lines[1:1 + n]:
    parts = line.split()
    op = parts[0]
    if op == "FILL":
        x = parts[1]
        used += cap[x] - cur[x]
        cur[x] = cap[x]
    elif op == "EMPTY":
        cur[parts[1]] = 0
    else:
        x, y = parts[1], parts[2]
        move = min(cur[x], cap[y] - cur[y])
        cur[x] -= move
        cur[y] += move
print(cur["A"], cur["B"])
print(used)
