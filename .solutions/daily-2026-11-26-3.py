import sys

a, b = map(int, sys.stdin.read().split())


def divisors(x):
    cnt = 0
    d = 1
    while d * d <= x:
        if x % d == 0:
            cnt += 1 if d * d == x else 2
        d += 1
    return cnt


primes = 0
best, best_cnt = -1, -1
for x in range(a, b + 1):
    c = divisors(x)
    if c == 2:
        primes += 1
    if c > best_cnt:
        best, best_cnt = x, c
print(primes)
print(best, best_cnt)
