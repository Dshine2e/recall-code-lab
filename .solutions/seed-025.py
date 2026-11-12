import sys

MOD = 1_000_000_007


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    s = data[1][:n]
    # ways[i] = 땅(0번)에서 출발해 i번 계단에 서는 방법의 수
    ways = [0] * (n + 1)
    ways[0] = 1
    for i in range(1, n + 1):
        if s[i - 1] == "#":
            continue
        total = ways[i - 1]
        if i >= 2:
            total += ways[i - 2]
        if i >= 3:
            total += ways[i - 3]
        ways[i] = total % MOD
    print(ways[n])


main()
