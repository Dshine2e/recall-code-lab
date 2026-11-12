import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    entries = []
    for i in range(n):
        name = data[1 + 3 * i]
        score = int(data[2 + 3 * i])
        minutes = int(data[3 + 3 * i])
        # 점수는 높은 순(부호를 뒤집어 오름차순으로), 시간은 짧은 순, 이름은 사전 순
        entries.append((-score, minutes, name))
    entries.sort()
    print("\n".join(name for _, _, name in entries))


main()
