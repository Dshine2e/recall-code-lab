import sys

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    a = data[1:1 + n]
    ans = [-1] * n
    stack = []  # 아직 오른쪽의 더 큰 수를 찾지 못한 인덱스
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            ans[stack.pop()] = x
        stack.append(i)
    sys.stdout.write(" ".join(map(str, ans)) + "\n")

main()
