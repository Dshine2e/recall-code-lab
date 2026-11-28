import sys

def main():
    data = sys.stdin.read().split()
    n, k = int(data[0]), int(data[1])
    s = data[2]
    st = []
    rem = k
    for ch in s:
        while rem and st and st[-1] < ch:
            st.pop()
            rem -= 1
        st.append(ch)
    print("".join(st[:n - k]))

main()
