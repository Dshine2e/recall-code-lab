import random
random.seed(112507)
# N × K = 200,000 을 두 모양으로: K 가 큰 경우가 O(N K^2) 풀이를 막는다
n, k = 4, 50000
print(n, k)
for _ in range(n):
    print(" ".join(str(random.randint(0, 10**9)) for _ in range(k)))
