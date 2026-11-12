import random

# N = Q = 200,000. 초깃값은 최대 10^9, 더하기 질의와 합 질의를 반씩 섞는다(합이 2^31 을 넘는다).
random.seed(20261112)
N = Q = 200000
out = [f"{N} {Q}", " ".join(str(random.randint(0, 10**9)) for _ in range(N))]
for i in range(Q - 1):
    l = random.randint(1, N)
    r = random.randint(l, N)
    if i % 2 == 0:
        out.append(f"1 {l} {r} {random.randint(1, 10**6)}")
    else:
        out.append(f"2 {l} {r}")
out.append(f"2 1 {N}")
print("\n".join(out))
