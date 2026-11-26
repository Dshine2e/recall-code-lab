import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    heap = []
    out = []
    for i in range(n):
        x = int(data[2 + i])
        if len(heap) < k:
            heapq.heappush(heap, x)
        elif x > heap[0]:
            heapq.heapreplace(heap, x)
        out.append(heap[0] if len(heap) == k else -1)
    print(" ".join(map(str, out)))


main()
