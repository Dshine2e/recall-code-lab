import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    total = sum(a)
    if total % 3 != 0:
        print(0)
        return
    t = total // 3
    ans = 0
    firsts = 0
    pre = 0
    # j = 두 번째 덩어리의 마지막 칸(1-based), 2 <= j <= n-1
    for idx in range(n - 1):
        pre += a[idx]
        # pre = a[0..idx] 합, 1-based 위치 idx+1
        if idx >= 1 and pre == 2 * t:
            ans += firsts
        if pre == t:
            firsts += 1
    print(ans)

main()
