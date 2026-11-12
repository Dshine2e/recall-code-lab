import random

random.seed(2026111227)
n = 200000
k = 100000
# 천천히 오르내리는 농도(무작위 걸음)를 0~1000 범위로 자른다
values = []
cur = 500
for _ in range(n):
    cur += random.randint(-15, 15)
    cur = max(0, min(1000, cur))
    values.append(cur)
print(n, k)
print(" ".join(map(str, values)))
