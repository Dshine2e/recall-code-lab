import random

random.seed(2026111225)
n = 200000
# 약 15%를 금 간 계단으로 만들되, 세 칸 연속으로 막히지 않게 하고 마지막 칸은 비워 둔다
cells = []
run = 0
for i in range(n):
    if i < n - 1 and run < 2 and random.random() < 0.15:
        cells.append("#")
        run += 1
    else:
        cells.append(".")
        run = 0
print(n)
print("".join(cells))
