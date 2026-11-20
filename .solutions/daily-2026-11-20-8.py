import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    up = {}
    down = {}
    up_pairs = down_pairs = 0
    for i in range(1, n + 1):
        a = int(data[i])
        k1 = a - i
        k2 = a + i
        c1 = up.get(k1, 0)
        c2 = down.get(k2, 0)
        up_pairs += c1
        down_pairs += c2
        up[k1] = c1 + 1
        down[k2] = c2 + 1
    print(up_pairs, down_pairs)

main()
