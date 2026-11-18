import sys

UNITS = [10, 50, 100, 500, 1000]


def main():
    data = sys.stdin.buffer.read().split()
    cnt = [int(x) for x in data[0:5]]
    q = int(data[5])
    pos = 6
    out = []
    for _ in range(q):
        price = int(data[pos])
        ins = [int(x) for x in data[pos + 1:pos + 6]]
        pos += 6
        paid = sum(u * a for u, a in zip(UNITS, ins))
        if paid < price:
            out.append("REJECT")
            continue
        have = [c + a for c, a in zip(cnt, ins)]
        change = paid - price
        give = [0] * 5
        for k in range(4, -1, -1):
            t = min(have[k], change // UNITS[k])
            give[k] = t
            change -= t * UNITS[k]
        if change != 0:
            out.append("NOCHANGE")
            continue
        cnt = [h - g for h, g in zip(have, give)]
        out.append("OK " + str(sum(give)))
    out.append(" ".join(map(str, cnt)))
    sys.stdout.write("\n".join(out) + "\n")


main()
