import random
random.seed(80823)
n = 200000
# 값이 크고 같은 값이 많이 섞인 입력: 앞 절반은 증가, 뒤 절반은 무작위 큰 값
a = [1000000 - (i // 1000) for i in range(n // 2)][::-1]
a += [random.choice([1000000, random.randint(999000, 1000000)]) for _ in range(n - n // 2)]
print(n)
print(" ".join(map(str, a)))
