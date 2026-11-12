import random

random.seed(2026111206)
n = 200000
out = [str(n)]
for i in range(n):
    if i % 3 == 0:
        # 지름이 겹치는 화분을 많이 만들어 같은 지름 처리를 시험한다
        d = random.randint(1, 1000)
        h = random.randint(1, 10**9)
    else:
        d = random.randint(1, 10**9)
        h = random.randint(1, 10**9)
    out.append(f"{d} {h}")
print("\n".join(out))
