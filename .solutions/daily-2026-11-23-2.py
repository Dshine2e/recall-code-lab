import sys
from math import gcd
data = sys.stdin.read().split()
n = int(data[0])
rooms = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)]
out = []
g_all = 0
for w, h in rooms:
    g = gcd(w, h)
    out.append(f"{g} {(w // g) * (h // g)}")
    g_all = gcd(g_all, g)
total = sum((w // g_all) * (h // g_all) for w, h in rooms)
out.append(f"{g_all} {total}")
print("\n".join(out))
