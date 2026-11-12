import sys


def is_palindrome_line(line):
    kept = [c.lower() for c in line if ("a" <= c.lower() <= "z") or ("0" <= c <= "9")]
    return kept == kept[::-1]


def main():
    lines = sys.stdin.read().split("\n")
    n = int(lines[0].strip())
    out = []
    for i in range(1, n + 1):
        line = lines[i].rstrip("\r")
        out.append("YES" if is_palindrome_line(line) else "NO")
    print("\n".join(out))


main()
