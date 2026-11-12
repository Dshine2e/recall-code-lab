import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    groups = {}
    for i in range(1, n + 1):
        key = "".join(sorted(set(data[i].decode())))
        if key in groups:
            groups[key].append(i)
        else:
            groups[key] = [i]
    out = [str(len(groups))]
    for members in groups.values():
        out.append(" ".join(map(str, members)))
    sys.stdout.write("\n".join(out) + "\n")


main()
