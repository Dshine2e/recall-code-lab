import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    left = [0] * n   # 왼쪽으로 a[i] 보다 엄격히 작은 값 직전까지의 길이
    right = [0] * n  # 오른쪽으로 a[i] 이하인 값 직전까지의 길이
    st = []
    for i in range(n):
        while st and a[st[-1]] >= a[i]:
            st.pop()
        left[i] = i - (st[-1] if st else -1)
        st.append(i)
    st = []
    for i in range(n - 1, -1, -1):
        while st and a[st[-1]] > a[i]:
            st.pop()
        right[i] = (st[-1] if st else n) - i
        st.append(i)
    print(sum(a[i] * left[i] * right[i] for i in range(n)))


main()
