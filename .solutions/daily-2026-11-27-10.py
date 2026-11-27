import sys


def main():
    lines = sys.stdin.read().split()
    a, b = lines[0], lines[1]
    n, m = len(a), len(b)
    # L[i][j] = a[i:] 와 b[j:] 의 LCS 길이
    L = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        row, nxt = L[i], L[i + 1]
        ai = a[i]
        for j in range(m - 1, -1, -1):
            if ai == b[j]:
                row[j] = nxt[j + 1] + 1
            else:
                x, y = nxt[j], row[j + 1]
                row[j] = x if x > y else y

    def next_table(s):
        k = len(s)
        t = [[k] * 26 for _ in range(k + 1)]
        for i in range(k - 1, -1, -1):
            t[i] = t[i + 1][:]
            t[i][ord(s[i]) - 97] = i
        return t

    na, nb = next_table(a), next_table(b)
    i = j = 0
    left = L[0][0]
    res = []
    while left > 0:
        for c in range(26):
            pi, pj = na[i][c], nb[j][c]
            if pi < n and pj < m and L[pi + 1][pj + 1] == left - 1:
                res.append(chr(97 + c))
                i, j = pi + 1, pj + 1
                left -= 1
                break
    print(len(res))
    if res:
        print("".join(res))


main()
