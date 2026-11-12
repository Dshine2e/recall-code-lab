import random

random.seed(2026111228)
n = 200000
k = 1000
cap = 205  # k * cap 이 n 을 조금 넘어 칸 수 제한도 자주 걸린다
w = [random.randint(1, 10**9) for _ in range(n)]
print(n, k, cap)
print(" ".join(map(str, w)))
