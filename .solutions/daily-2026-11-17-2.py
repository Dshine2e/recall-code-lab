import sys


def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


data = sys.stdin.read().split()
t = int(data[0])
out = []
for i in range(t):
    a, b, d = int(data[1 + 3 * i]), int(data[2 + 3 * i]), int(data[3 + 3 * i])
    l = a // gcd(a, b) * b
    out.append(f"{l} {d // l}")
print("\n".join(out))
