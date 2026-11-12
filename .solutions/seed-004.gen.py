import random

random.seed(2026111204)
n = 200000
# 거의 끝까지 올바르게 짝이 맞다가 마지막 근처에서 깨지는 긴 문자열
openers = "([{"
closers = {"(": ")", "[": "]", "{": "}"}
letters = "abcdefghijklmnopqrstuvwxyz0123456789"
out = []
stack = []
while len(out) < n - 2:
    remain = n - 2 - len(out)
    roll = random.random()
    if roll < 0.15:
        out.append(random.choice(letters))
    elif stack and (roll < 0.55 or len(stack) >= remain):
        out.append(closers[stack.pop()])
    else:
        ch = random.choice(openers)
        stack.append(ch)
        out.append(ch)
# 남은 여는 괄호 중 일부만 닫고 다른 종류로 닫아 끝부분에서 오류가 나게 한다
out.append("(")
out.append("]")
print("".join(out))
