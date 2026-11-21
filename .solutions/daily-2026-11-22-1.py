import sys
def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    out = []
    for name in data[1:1 + n]:
        if "_" in name:
            parts = name.split("_")
            out.append(parts[0] + "".join(w[0].upper() + w[1:] for w in parts[1:]))
        else:
            s = []
            for ch in name:
                if ch.isupper():
                    s.append("_" + ch.lower())
                else:
                    s.append(ch)
            out.append("".join(s))
    print("\n".join(out))
main()
