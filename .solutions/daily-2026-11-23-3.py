import sys
data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
d = a[1] - a[0]
arith = all(a[i + 1] - a[i] == d for i in range(n - 1))
geo = False
r = 0
if a[0] != 0 and a[1] % a[0] == 0 and a[1] // a[0] != 0:
    r = a[1] // a[0]
    geo = all(a[i + 1] == a[i] * r for i in range(n - 1))
elif all(x == 0 for x in a):
    geo, r = True, 1
if arith and geo:
    print("BOTH")
    print(a[-1] + d, a[-1] * r)
elif arith:
    print("ARITH")
    print(a[-1] + d)
elif geo:
    print("GEO")
    print(a[-1] * r)
else:
    print("NONE")
