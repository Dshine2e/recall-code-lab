import sys

def main():
    data = sys.stdin.read().split()
    ins, dele, rep = int(data[0]), int(data[1]), int(data[2])
    a, b = data[3], data[4]
    n, m = len(a), len(b)
    prev = [j * ins for j in range(m + 1)]
    for i in range(1, n + 1):
        cur = [i * dele] + [0] * m
        ai = a[i - 1]
        for j in range(1, m + 1):
            best = prev[j - 1] + (0 if ai == b[j - 1] else rep)
            x = prev[j] + dele
            if x < best:
                best = x
            x = cur[j - 1] + ins
            if x < best:
                best = x
            cur[j] = best
        prev = cur
    print(prev[m])

main()
