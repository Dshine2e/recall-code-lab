import sys


def main():
    s = sys.stdin.readline().strip()
    pair = {")": "(", "]": "[", "}": "{"}
    stack = []  # (여는 괄호, 1-based 위치)
    for i, ch in enumerate(s, 1):
        if ch in "([{":
            stack.append((ch, i))
        elif ch in pair:
            if not stack or stack[-1][0] != pair[ch]:
                print(i)
                return
            stack.pop()
    if stack:
        print(stack[0][1])
    else:
        print("OK")


main()
