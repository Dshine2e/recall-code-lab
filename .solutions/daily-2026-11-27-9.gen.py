import random

random.seed(9271127)
N = 200_000
perm = list(range(1, N + 1))
random.shuffle(perm)
edges = []
for k in range(1, N):
    # 앞쪽 절반은 긴 사슬, 뒤쪽은 무작위 부모
    p = perm[k - 1] if k < N // 2 else perm[random.randint(0, k - 1)]
    edges.append((perm[k], p) if random.random() < 0.5 else (p, perm[k]))
random.shuffle(edges)
c = [random.randint(10**9 - 10**6, 10**9) if random.random() < 0.7 else random.randint(1, 10**9) for _ in range(N)]
out = [str(N), " ".join(map(str, c))]
out += [f"{u} {v}" for u, v in edges]
print("\n".join(out))
