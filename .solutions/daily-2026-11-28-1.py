import sys

def main():
    a, b, p, q, w = map(int, sys.stdin.read().split())
    res = []
    for x in range(p + 1):
        for y in range(q + 1):
            if a * x + b * y == w:
                res.append((x, y))
    out = [str(len(res))]
    for x, y in res:
        out.append(f"{x} {y}")
    print("\n".join(out))

main()
