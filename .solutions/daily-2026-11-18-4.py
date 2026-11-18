import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    h = list(map(int, data[1:1 + n]))
    see = [0] * n
    pairs = 0
    stack = []
    for j in range(n):
        hj = h[j]
        while stack and h[stack[-1]] < hj:
            i = stack.pop()
            see[i] += 1
            see[j] += 1
            pairs += 1
        if stack:
            i = stack[-1]
            see[i] += 1
            see[j] += 1
            pairs += 1
            if h[i] == hj:
                stack.pop()
        stack.append(j)
    sys.stdout.write(str(pairs) + "\n" + " ".join(map(str, see)) + "\n")


main()
