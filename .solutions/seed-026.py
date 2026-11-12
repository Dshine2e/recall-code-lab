import sys


def main():
    line = sys.stdin.readline().rstrip("\r\n")
    totals = {}
    for token in line.split(","):
        token = token.strip()
        if "*" in token:
            name, count = token.split("*")
            count = int(count)
        else:
            name, count = token, 1
        totals[name] = totals.get(name, 0) + count
    out = [f"{name} {totals[name]}" for name in sorted(totals)]
    print("\n".join(out))


main()
