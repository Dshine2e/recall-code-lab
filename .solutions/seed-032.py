import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    h = list(map(int, data[1:1 + n]))
    # left[i]: 왼쪽에서 h[i]보다 엄격히 낮은 가장 가까운 위치 + 1
    left = [0] * n
    st = []
    for i in range(n):
        while st and h[st[-1]] >= h[i]:
            st.pop()
        left[i] = st[-1] + 1 if st else 0
        st.append(i)
    # right[i]: 오른쪽에서 h[i]보다 엄격히 낮은 가장 가까운 위치 - 1
    right = [0] * n
    st = []
    for i in range(n - 1, -1, -1):
        while st and h[st[-1]] >= h[i]:
            st.pop()
        right[i] = st[-1] - 1 if st else n - 1
        st.append(i)
    best = 0
    seen = set()
    for i in range(n):
        area = h[i] * (right[i] - left[i] + 1)
        if area > best:
            best = area
            seen = {(left[i], right[i])}
        elif area == best:
            seen.add((left[i], right[i]))
    sys.stdout.write("%d\n%d\n" % (best, len(seen)))


main()
