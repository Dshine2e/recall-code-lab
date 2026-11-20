import sys

MOD = 1_000_000_007


def main():
    data = sys.stdin.buffer.read().split()
    h, w, k = int(data[0]), int(data[1]), int(data[2])
    pts = [(int(data[3 + 2 * i]), int(data[4 + 2 * i])) for i in range(k)]
    pts.sort()
    pts.append((h, w))
    m = h + w
    fact = [1] * (m + 1)
    for i in range(1, m + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv = [1] * (m + 1)
    inv[m] = pow(fact[m], MOD - 2, MOD)
    for i in range(m, 0, -1):
        inv[i - 1] = inv[i] * i % MOD

    # f[i] = (1,1) 에서 i 번째 점까지, 앞의 막힌 칸을 하나도 지나지 않는 경로 수
    f = []
    rows = [p[0] for p in pts]
    cols = [p[1] for p in pts]
    for i in range(len(pts)):
        r, c = rows[i], cols[i]
        val = fact[r + c - 2] * inv[r - 1] % MOD * inv[c - 1] % MOD
        for j in range(i):
            rj, cj = rows[j], cols[j]
            if cj <= c:
                dr = r - rj
                dc = c - cj
                val -= f[j] * fact[dr + dc] % MOD * inv[dr] % MOD * inv[dc]
        f.append(val % MOD)
    print(f[-1])


main()
