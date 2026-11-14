import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    iv = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
    blocks = 0
    total = 0
    longest = 0
    cs, ce = iv[0]
    for s, e in iv[1:]:
        if s <= ce:
            if e > ce:
                ce = e
        else:
            blocks += 1
            total += ce - cs
            longest = max(longest, ce - cs)
            cs, ce = s, e
    blocks += 1
    total += ce - cs
    longest = max(longest, ce - cs)
    print(blocks, total, longest)

main()
