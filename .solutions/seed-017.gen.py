import random

# N = M = 200,000 인 DAG. 번호를 섞은 뒤 앞 순서 → 뒤 순서로만 간선을 둔다.
# 절반은 긴 사슬(깊이 약 10^5), 나머지는 무작위 간선이라 시작 시각 합이 2^31 을 훌쩍 넘는다.
random.seed(20261112)
N = M = 200000
perm = list(range(1, N + 1))
random.shuffle(perm)
t = [random.randint(1, 10**9) for _ in range(N)]
edges = []
for i in range(N // 2 - 1):
    edges.append((perm[i], perm[i + 1]))
while len(edges) < M:
    x = random.randrange(N - 1)
    y = random.randrange(x + 1, min(N, x + 50))
    edges.append((perm[x], perm[y]))
random.shuffle(edges)
out = [f"{N} {M}", " ".join(map(str, t))]
out.extend(f"{a} {b}" for a, b in edges)
print("\n".join(out))
