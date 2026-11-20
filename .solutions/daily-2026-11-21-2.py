import sys


def main():
    data = sys.stdin.read().split()
    n, k = int(data[0]), int(data[1])
    cnt = {}
    for name in data[2:2 + n]:
        cnt[name] = cnt.get(name, 0) + 1
    chosen = [(c, name) for name, c in cnt.items() if c >= k]
    chosen.sort(key=lambda x: (-x[0], x[1]))
    if not chosen:
        print("NONE")
    else:
        print("\n".join(f"{name} {c}" for c, name in chosen))


main()
