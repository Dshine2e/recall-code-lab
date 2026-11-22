import sys
from functools import cmp_to_key


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    booths = []
    for i in range(n):
        name = data[1 + 4 * i].decode()
        v, s, c = int(data[2 + 4 * i]), int(data[3 + 4 * i]), int(data[4 + 4 * i])
        booths.append((name, v, s, c))

    def cmp(a, b):
        left, right = a[2] * b[3], b[2] * a[3]
        if left != right:
            return -1 if left > right else 1
        if a[1] != b[1]:
            return -1 if a[1] > b[1] else 1
        return -1 if a[0] < b[0] else (1 if a[0] > b[0] else 0)

    booths.sort(key=cmp_to_key(cmp))
    sys.stdout.write("\n".join(b[0] for b in booths) + "\n")


main()
