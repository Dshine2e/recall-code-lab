import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    t = list(map(int, data[2:2 + n]))
    cnt = [0] * (m + 1)
    have = 0
    left = 0
    best_len, best_start = n + 1, -1
    for right in range(n):
        x = t[right]
        if cnt[x] == 0:
            have += 1
        cnt[x] += 1
        while have == m:
            if right - left + 1 < best_len:
                best_len, best_start = right - left + 1, left
            y = t[left]
            cnt[y] -= 1
            if cnt[y] == 0:
                have -= 1
            left += 1
    if best_start < 0:
        print(-1)
    else:
        print(best_len, best_start + 1)

main()
