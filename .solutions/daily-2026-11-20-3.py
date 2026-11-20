import sys

data = sys.stdin.read().split()
n = int(data[0])
out = []
for x in map(int, data[1:1 + n]):
    s = 0
    d = 1
    while d * d <= x:
        if x % d == 0:
            s += d
            if d != x // d:
                s += x // d
        d += 1
    s -= x
    if s == x:
        kind = "PERFECT"
    elif s < x:
        kind = "DEFICIENT"
    else:
        kind = "ABUNDANT"
    out.append(f"{s} {kind}")
print("\n".join(out))
