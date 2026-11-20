import random

random.seed(2026112007)
n = 200000
# 앞의 대부분은 계단 모양(겹치지 않음)으로 멀리 간 뒤 마지막에 되돌아와 늦게 다시 밟게 만든다
half = (n - 10) // 2
s = "RU" * (half // 2) + "LD" * (half // 2)
s += "".join(random.choice("UDLR") for _ in range(n - len(s)))
print(n)
print(s)
