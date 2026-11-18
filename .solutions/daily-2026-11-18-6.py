import sys


def main():
    data = sys.stdin.read().split()
    h, w, k = int(data[0]), int(data[1]), int(data[2])
    rows = data[3:3 + h]
    # s: 수확량 누적 합, r: 바위 개수 누적 합 (1-based, 0번 행/열은 0)
    s = [[0] * (w + 1) for _ in range(h + 1)]
    r = [[0] * (w + 1) for _ in range(h + 1)]
    for i in range(1, h + 1):
        line = rows[i - 1]
        si, sp = s[i], s[i - 1]
        ri, rp = r[i], r[i - 1]
        run_s = run_r = 0
        for j in range(1, w + 1):
            ch = line[j - 1]
            if ch == "#":
                run_r += 1
            else:
                run_s += ord(ch) - 48
            si[j] = sp[j] + run_s
            ri[j] = rp[j] + run_r
    best = -1
    br = bc = 0
    for i in range(k, h + 1):
        s1, s0 = s[i], s[i - k]
        r1, r0 = r[i], r[i - k]
        for j in range(k, w + 1):
            if r1[j] - r0[j] - r1[j - k] + r0[j - k]:
                continue
            v = s1[j] - s0[j] - s1[j - k] + s0[j - k]
            if v > best:
                best, br, bc = v, i - k + 1, j - k + 1
    print(-1 if best < 0 else f"{best} {br} {bc}")


main()
