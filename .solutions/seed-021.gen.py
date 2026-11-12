import random

random.seed(2026111221)
n = 200000
scores = []
# 절반은 넓은 범위 전체에서, 절반은 작은 값 집합에서 골라 같은 점수가 많이 겹치게 한다
for _ in range(n // 2):
    scores.append(random.randint(-10**9, 10**9))
pool = [random.randint(-10**9, 10**9) for _ in range(1000)] + [-10**9, 10**9, 0]
for _ in range(n - n // 2):
    scores.append(random.choice(pool))
random.shuffle(scores)
print(n)
print(" ".join(map(str, scores)))
