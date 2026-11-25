import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    ks = data[1:1 + n]
    # 펜윅 트리: 남아 있으면 1. 전부 1인 상태는 tree[i] = i & -i 로 바로 만든다.
    tree = [0] * (n + 1)
    for i in range(1, n + 1):
        tree[i] = i & (-i)
    LOG = 1
    while LOG * 2 <= n:
        LOG *= 2
    out = []
    start = 0  # 남은 사람 중 다음에 1번으로 세는 사람의 순위(0부터)
    remain = n
    for t in range(n):
        k = int(ks[t])
        target = (start + k - 1) % remain  # 0부터 센 순위
        # target + 1 번째로 남아 있는 사람 찾기(이분 내려가기)
        need = target + 1
        pos = 0
        step = LOG
        while step:
            nxt = pos + step
            if nxt <= n and tree[nxt] < need:
                pos = nxt
                need -= tree[nxt]
            step >>= 1
        who = pos + 1
        out.append(who)
        i = who
        while i <= n:
            tree[i] -= 1
            i += i & (-i)
        remain -= 1
        if remain:
            start = target % remain
    sys.stdout.write(" ".join(map(str, out)) + "\n")


main()
