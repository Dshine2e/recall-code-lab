import sys

data = sys.stdin.read().split()
t = int(data[0])
out = []
for i in range(t):
    a, b, c = sorted(map(int, data[1 + 3 * i:4 + 3 * i]))
    if a + b <= c:
        out.append("불가")
        continue
    if a * a + b * b == c * c:
        angle = "직각"
    elif a * a + b * b < c * c:
        angle = "둔각"
    else:
        angle = "예각"
    if a == c:
        side = "정삼각형"
    elif a == b or b == c:
        side = "이등변"
    else:
        side = "부등변"
    out.append(angle + " " + side)
print("\n".join(out))
