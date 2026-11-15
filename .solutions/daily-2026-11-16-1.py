import sys

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    out = []
    for i in range(1, n + 1):
        x = int(data[i])
        steps = 0
        while x >= 10:
            s = 0
            while x > 0:
                s += x % 10
                x //= 10
            x = s
            steps += 1
        out.append(f"{x} {steps}")
    print("\n".join(out))

main()
