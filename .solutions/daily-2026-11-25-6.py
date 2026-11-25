import sys


def main():
    s, t = sys.stdin.read().split()
    t = int(t)
    n = len(s)
    count = 0

    def go(pos, total):
        # pos 에서 시작하는 수를 고른다. total 은 앞까지의 값.
        nonlocal count
        limit = pos + 1 if s[pos] == '0' else n
        val = 0
        for end in range(pos + 1, limit + 1):
            val = val * 10 + (ord(s[end - 1]) - 48)
            if pos == 0:
                nxt = [val]
            else:
                nxt = [total + val, total - val]
            for v in nxt:
                if end == n:
                    if v == t:
                        count += 1
                else:
                    go(end, v)

    go(0, 0)
    print(count)


main()
