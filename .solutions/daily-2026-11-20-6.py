import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    # 상태: (수익 합, -영업 일수) 를 크게. take = 오늘 영업, rest = 오늘 쉼
    rest = (0, 0)
    take = None
    for i in range(n):
        a = int(data[1 + i])
        new_take = (rest[0] + a, rest[1] - 1)
        new_rest = rest if take is None or rest >= take else take
        take, rest = new_take, new_rest
    best = rest if rest >= take else take
    print(best[0], -best[1])

main()
