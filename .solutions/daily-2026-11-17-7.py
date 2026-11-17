import sys
from collections import deque

data = sys.stdin.buffer.read().split()
q = int(data[0])
dq = deque()
rev = False
out = []
pos = 1
for _ in range(q):
    c = data[pos]
    pos += 1
    if c == b"F" or c == b"B":
        x = int(data[pos])
        pos += 1
        if (c == b"F") != rev:
            dq.appendleft(x)
        else:
            dq.append(x)
    elif c == b"R":
        rev = not rev
    else:
        if not dq:
            out.append("EMPTY")
        elif (c == b"P") != rev:
            out.append(str(dq.popleft()))
        else:
            out.append(str(dq.pop()))
items = list(dq)
if rev:
    items.reverse()
out.append(str(len(items)))
if items:
    out.append(" ".join(map(str, items)))
sys.stdout.write("\n".join(out) + "\n")
