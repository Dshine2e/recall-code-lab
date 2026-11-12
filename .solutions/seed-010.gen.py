import random

random.seed(2026111210)
n, k = 200000, 3000
out = [f"{n} {k}"]
for i in range(n):
    if i < 10:
        # 끝 시각이 최댓값인 공연(끝 + 정리 시간이 32비트 범위를 넘는다)
        s = random.randint(0, 10**9 - 1)
        e = 10**9
    else:
        s = random.randint(0, 10**9 - 1)
        e = min(10**9, s + random.randint(1, 50000))
    out.append(f"{s} {e}")
print("\n".join(out))
