import random
random.seed(2026112206)
def make(n):
    pts = sorted(random.sample(range(0, 10**9 + 1), 2 * n))
    return [(pts[2 * i], pts[2 * i + 1]) for i in range(n)]
n = m = 200000
print(n, m)
for s, e in make(n): print(s, e)
for s, e in make(m): print(s, e)
