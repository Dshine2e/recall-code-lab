import random
random.seed(2026112208)
n = 200000
g = 720720
a = [g * random.randint(1, 1387) for _ in range(n)]
a[123456] = 999999937  # 큰 소수 하나가 끼어 있어 그것을 빼야 한다
print(n)
print(" ".join(map(str, a)))
