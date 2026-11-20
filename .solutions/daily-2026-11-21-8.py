import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    low = []   # 작은 절반, 부호를 뒤집어 최대 힙처럼 쓴다
    high = []  # 큰 절반, 최소 힙
    out = []
    for i in range(1, n + 1):
        x = int(data[i])
        if not low or x <= -low[0]:
            heapq.heappush(low, -x)
        else:
            heapq.heappush(high, x)
        if len(low) > len(high) + 1:
            heapq.heappush(high, -heapq.heappop(low))
        elif len(high) > len(low):
            heapq.heappush(low, -heapq.heappop(high))
        out.append(-low[0])
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
