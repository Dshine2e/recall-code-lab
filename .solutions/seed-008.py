import sys
from collections import Counter


def main():
    data = sys.stdin.read().split()
    magnets, name = data[0], data[1]
    have = Counter(magnets)
    need = Counter(name)
    print(min(have[c] // k for c, k in need.items()))


main()
