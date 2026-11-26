import sys

data = sys.stdin.read().split()
f, q = int(data[0]), int(data[1])
cur = 1
total = 0
cut = 0
idx = 2
for _ in range(q):
    cmd = data[idx]
    v = int(data[idx + 1])
    idx += 2
    if cmd == "UP":
        nxt = min(f, cur + v)
        if nxt - cur < v:
            cut += 1
    elif cmd == "DOWN":
        nxt = max(1, cur - v)
        if cur - nxt < v:
            cut += 1
    else:
        nxt = v
    total += abs(nxt - cur)
    cur = nxt
print(cur)
print(total)
print(cut)
