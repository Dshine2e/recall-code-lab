import random
random.seed(202611113)
n = 200000
# 작은 값이 많아 같은 합 구간이 많이 생기는 최대 입력
a = [random.randint(1, 3) for _ in range(n)]
print(n, 30)
print(*a)
