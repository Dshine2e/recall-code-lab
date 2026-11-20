import sys


def main():
    lines = sys.stdin.buffer.read().decode().split("\n")
    n = int(lines[0])
    stat = {}
    for line in lines[1:1 + n]:
        user, status, size = None, 0, 0
        for tok in line.split():
            key, _, value = tok.partition("=")
            if key == "user":
                user = value
            elif key == "status":
                status = int(value)
            elif key == "bytes":
                size = int(value)
        s = stat.get(user)
        if s is None:
            s = stat[user] = [0, 0, 0]
        if status < 400:
            s[0] += 1
            s[2] += size
        else:
            s[1] += 1
    out = [f"{u} {s[0]} {s[1]} {s[2]}" for u, s in sorted(stat.items())]
    sys.stdout.write("\n".join(out) + "\n")


main()
