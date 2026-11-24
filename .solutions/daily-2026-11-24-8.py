import sys

def main():
    data = sys.stdin.buffer.read().split()
    k = int(data[0])
    n = 1 << k
    hp = [int(x) for x in data[1:1 + n]]
    wins = [0] * n
    alive = list(range(n))
    while len(alive) > 1:
        nxt = []
        for i in range(0, len(alive), 2):
            a, b = alive[i], alive[i + 1]
            if hp[a] >= hp[b]:
                w, l = a, b
            else:
                w, l = b, a
            hp[w] -= hp[l]
            wins[w] += 1
            nxt.append(w)
        alive = nxt
    print(alive[0] + 1)
    print(" ".join(map(str, wins)))

main()
