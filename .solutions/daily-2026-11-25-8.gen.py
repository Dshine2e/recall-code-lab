import random
random.seed(112508)
n = 200000
s = set()
# 짧은 번호와 긴 번호를 섞어 접두사 관계가 꽤 생기게 한다
while len(s) < n:
    L = random.choice([5, 6, 8, 10, 10, 10])
    s.add("".join(random.choice("0123456789") for _ in range(L)))
codes = list(s)
random.shuffle(codes)
print(n)
print("\n".join(codes))
