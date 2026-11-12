import random

random.seed(2026111209)
n, m = 200000, 200000
# 회원 번호 일부는 좁은 범위에서 뽑아 겹침·중복을 많이 만들고, 일부는 큰 번호로 뽑는다
def pick():
    if random.random() < 0.6:
        return random.randint(1, 150000)
    return random.randint(1, 10**9)

a = [pick() for _ in range(n)]
b = [pick() for _ in range(m)]
a[0], b[0] = 10**9, 10**9
print(n, m)
print(" ".join(map(str, a)))
print(" ".join(map(str, b)))
