import random
random.seed(112610)
n = 200000
k = 100000
# 음수가 많고 가끔 큰 양수가 있어 덱이 길어졌다 줄었다 한다
s = [random.randint(-10**9, 10**8) if random.random() < 0.9 else random.randint(0, 10**9) for _ in range(n)]
print(n, k)
print(" ".join(map(str, s)))
