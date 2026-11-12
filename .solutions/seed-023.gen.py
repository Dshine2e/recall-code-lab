import random

random.seed(2026111223)
n = 15
lines = [str(n)]
for i in range(n):
    row = [0 if i == j else random.randint(0, 10**9) for j in range(n)]
    lines.append(" ".join(map(str, row)))
# 선행 조건은 몇 개만 둔다(조건이 적을수록 살펴볼 상태가 많다). 번호가 작은 별만 선행으로 써서 순환이 없게 한다.
need = {12: [3], 15: [1, 7], 9: [4]}
for i in range(1, n + 1):
    pre = need.get(i, [])
    lines.append(" ".join(map(str, [len(pre)] + pre)))
print("\n".join(lines))
