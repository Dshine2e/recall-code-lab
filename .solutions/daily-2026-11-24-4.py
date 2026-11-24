import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    colors = []
    counts = []
    for i in range(n):
        c = data[2 + i]
        if colors and colors[-1] == c:
            counts[-1] += 1
        else:
            colors.append(c)
            counts.append(1)
        if counts[-1] == k:
            colors.pop()
            counts.pop()
    out = []
    for c, m in zip(colors, counts):
        out.extend([c.decode()] * m)
    print(len(out))
    if out:
        print(" ".join(out))

main()
