import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    dq = deque()
    rev = False
    out = []
    i = 1
    for _ in range(q):
        c = data[i]
        i += 1
        if c == b"1" or c == b"2":
            x = int(data[i])
            i += 1
            front = (c == b"1") != rev
            if front:
                dq.appendleft(x)
            else:
                dq.append(x)
        elif c == b"3":
            if not dq:
                out.append("-1")
            elif rev:
                out.append(str(dq.pop()))
            else:
                out.append(str(dq.popleft()))
        else:
            rev = not rev
    rest = list(dq)
    if rev:
        rest.reverse()
    out.append(" ".join(map(str, rest)) if rest else "EMPTY")
    sys.stdout.write("\n".join(out) + "\n")


main()
