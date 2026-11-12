import sys


def count_divisors(x):
    cnt = 0
    i = 1
    while i * i <= x:
        if x % i == 0:
            cnt += 1 if i * i == x else 2
        i += 1
    return cnt


def main():
    data = sys.stdin.read().split()
    q = int(data[0])
    out = []
    for k in range(q):
        x = int(data[1 + k])
        d = count_divisors(x)
        out.append(f"{d} {'YES' if d == 2 else 'NO'}")
    print("\n".join(out))


main()
