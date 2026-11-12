import random

# N = 200,000. 대부분은 앞쪽에 몰려 도착해 대기열이 길어지고(대기 시간 합이 2^31 을 넘는다),
# 일부는 10^9 근처에 늦게 도착해 기계가 쉬는 구간이 생긴다. 입력 순서는 섞는다.
random.seed(20261112)
N = 200000
jobs = []
for i in range(N):
    if i % 10 == 0:
        a = random.randint(999_000_000, 1_000_000_000)
    else:
        a = random.randint(0, 2_000_000)
    d = random.randint(1, 10000)
    jobs.append((a, d))
random.shuffle(jobs)
out = [str(N)]
out.extend(f"{a} {d}" for a, d in jobs)
print("\n".join(out))
