import sys

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    s = data[1][:n]
    first = {0: -1}  # 누적 합이 처음 나온 위치. 아무것도 안 고른 상태(합 0)는 위치 -1
    total = 0
    best = 0
    for i, ch in enumerate(s):
        total += 1 if ch == "O" else -1
        if total in first:
            if i - first[total] > best:
                best = i - first[total]
        else:
            first[total] = i
    print(best)

main()
