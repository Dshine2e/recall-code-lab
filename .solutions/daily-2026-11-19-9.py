import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    log = max(1, (n - 1).bit_length())
    size = 1 << log
    NEG = -(1 << 62)
    mx = [NEG] * (2 * size)
    cnt = [0] * (2 * size)
    lz = [0] * size
    for i in range(n):
        mx[size + i] = int(data[2 + i])
        cnt[size + i] = 1
    for k in range(size - 1, 0, -1):
        a, b = mx[2 * k], mx[2 * k + 1]
        if a > b:
            mx[k] = a; cnt[k] = cnt[2 * k]
        elif a < b:
            mx[k] = b; cnt[k] = cnt[2 * k + 1]
        else:
            mx[k] = a; cnt[k] = cnt[2 * k] + cnt[2 * k + 1]

    def push(k):
        z = lz[k]
        if z:
            c = 2 * k
            mx[c] += z
            mx[c + 1] += z
            if c < size:
                lz[c] += z
                lz[c + 1] += z
            lz[k] = 0

    def pull(k):
        a, b = mx[2 * k], mx[2 * k + 1]
        if a > b:
            mx[k] = a + lz[k]; cnt[k] = cnt[2 * k]
        elif a < b:
            mx[k] = b + lz[k]; cnt[k] = cnt[2 * k + 1]
        else:
            mx[k] = a + lz[k]; cnt[k] = cnt[2 * k] + cnt[2 * k + 1]

    out = []
    pos = 2 + n
    for _ in range(q):
        t = data[pos]
        l = int(data[pos + 1]) - 1 + size
        r = int(data[pos + 2]) + size  # 반열린 [l, r)
        if t == b"1":
            x = int(data[pos + 3])
            pos += 4
            for i in range(log, 0, -1):
                if ((l >> i) << i) != l:
                    push(l >> i)
                if ((r >> i) << i) != r:
                    push((r - 1) >> i)
            l2, r2 = l, r
            while l2 < r2:
                if l2 & 1:
                    mx[l2] += x
                    if l2 < size:
                        lz[l2] += x
                    l2 += 1
                if r2 & 1:
                    r2 -= 1
                    mx[r2] += x
                    if r2 < size:
                        lz[r2] += x
                l2 >>= 1
                r2 >>= 1
            for i in range(1, log + 1):
                if ((l >> i) << i) != l:
                    pull(l >> i)
                if ((r >> i) << i) != r:
                    pull((r - 1) >> i)
        else:
            pos += 3
            for i in range(log, 0, -1):
                if ((l >> i) << i) != l:
                    push(l >> i)
                if ((r >> i) << i) != r:
                    push((r - 1) >> i)
            best, c = NEG, 0
            while l < r:
                if l & 1:
                    v = mx[l]
                    if v > best:
                        best = v; c = cnt[l]
                    elif v == best:
                        c += cnt[l]
                    l += 1
                if r & 1:
                    r -= 1
                    v = mx[r]
                    if v > best:
                        best = v; c = cnt[r]
                    elif v == best:
                        c += cnt[r]
                l >>= 1
                r >>= 1
            out.append(f"{best} {c}")
    sys.stdout.write("\n".join(out) + ("\n" if out else ""))

main()
