import sys


def count_upto(n, k):
    """1 이상 n 이하에서 이웃한 자리가 모두 다르고 자릿수 합이 k의 배수인 수의 개수."""
    if n <= 0:
        return 0
    d = list(map(int, str(n)))
    free = [[0] * k for _ in range(10)]  # 이미 n보다 작아진 수: [마지막 숫자][합 % k]
    tight_ok = True
    tight_mod = 0
    for i, cur in enumerate(d):
        new = [[0] * k for _ in range(10)]
        for p in range(10):
            row = free[p]
            if not any(row):
                continue
            for dig in range(10):
                if dig == p:
                    continue
                tgt = new[dig]
                for m in range(k):
                    c = row[m]
                    if c:
                        tgt[(m + dig) % k] += c
        if tight_ok:
            lo = 1 if i == 0 else 0
            for dig in range(lo, cur):
                if i > 0 and dig == d[i - 1]:
                    continue
                new[dig][(tight_mod + dig) % k] += 1
            if i > 0 and cur == d[i - 1]:
                tight_ok = False
            else:
                tight_mod = (tight_mod + cur) % k
        if i > 0:
            for dig in range(1, 10):
                new[dig][dig % k] += 1
        free = new
    total = sum(free[p][0] for p in range(10))
    if tight_ok and tight_mod == 0:
        total += 1
    return total


def main():
    a, b, k = map(int, sys.stdin.read().split())
    print(count_upto(b, k) - count_upto(a - 1, k))


main()
