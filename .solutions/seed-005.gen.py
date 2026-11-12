import random

random.seed(2026111205)
n, q = 200000, 10**9
ts = []
for i in range(n):
    # 대부분 5바퀴를 꽉 채우게 해서 큐 연산 수를 최대(약 10^6)로 만든다
    roll = i % 5
    if roll == 0:
        ts.append(5 * q)
    elif roll == 1:
        ts.append(random.randint(4 * q + 1, 5 * q))
    elif roll == 2:
        ts.append(q * random.randint(1, 5))
    else:
        ts.append(random.randint(1, 5 * q))
print(n, q)
print(" ".join(map(str, ts)))
