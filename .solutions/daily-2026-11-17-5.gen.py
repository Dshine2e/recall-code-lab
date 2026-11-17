import random

random.seed(2026111705)
n = 200000
# 절반은 긴 사슬(재귀 깊이 함정), 나머지는 무작위로 붙인다
perm = list(range(2, n + 1))
random.shuffle(perm)
nodes = [1]
edges = []
half = n // 2
for i, v in enumerate(perm):
    if i < half:
        u = nodes[-1]
    else:
        u = random.choice(nodes)
    edges.append((u, v) if random.random() < 0.5 else (v, u))
    nodes.append(v)
random.shuffle(edges)
out = [str(n)] + [f"{u} {v}" for u, v in edges]
print("\n".join(out))
