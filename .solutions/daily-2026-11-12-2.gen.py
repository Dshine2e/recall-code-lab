import random

random.seed(2026111202)
n = 200000
# O와 X가 반반인 무작위 문자열(긴 균형 구간이 여러 번 생긴다)
s = "".join("O" if random.random() < 0.5 else "X" for _ in range(n))
print(n)
print(s)
