import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    jobs = []
    for i in range(n):
        a = int(data[1 + 2 * i])
        d = int(data[2 + 2 * i])
        jobs.append((a, i + 1, d))
    jobs.sort()
    heap = []
    order = []
    now = 0
    wait = 0
    p = 0
    push = heapq.heappush
    pop = heapq.heappop
    while len(order) < n:
        if not heap and jobs[p][0] > now:
            now = jobs[p][0]
        while p < n and jobs[p][0] <= now:
            a, idx, d = jobs[p]
            push(heap, (d, a, idx))
            p += 1
        d, a, idx = pop(heap)
        wait += now - a
        now += d
        order.append(idx)
    sys.stdout.write(" ".join(map(str, order)) + "\n" + str(wait) + "\n")


main()
