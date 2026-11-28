import sys

def main():
    data = sys.stdin.read().split()
    q = int(data[0])
    out = []
    for s in data[1:1 + q]:
        steps = 0
        while len(s) > 1:
            s = str(sum(int(c) for c in s))
            steps += 1
        out.append(f"{steps} {s}")
    print("\n".join(out))

main()
