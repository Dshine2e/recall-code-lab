import sys


def main():
    data = sys.stdin.read().split()
    n, k, m = int(data[0]), int(data[1]), int(data[2])
    bad = [[False] * (n + 1) for _ in range(n + 1)]
    for i in range(m):
        a = int(data[3 + 2 * i])
        b = int(data[4 + 2 * i])
        bad[a][b] = True
        bad[b][a] = True

    teams = []
    chosen = []

    def pick(start):
        if len(chosen) == k:
            teams.append(" ".join(map(str, chosen)))
            return
        # 남은 사람이 모자라면 더 볼 필요가 없다
        for p in range(start, n - (k - len(chosen)) + 2):
            if any(bad[p][q] for q in chosen):
                continue
            chosen.append(p)
            pick(p + 1)
            chosen.pop()

    pick(1)
    out = [str(len(teams))]
    out.extend(teams)
    print("\n".join(out))


main()
