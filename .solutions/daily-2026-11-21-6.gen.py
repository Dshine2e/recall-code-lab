import random

random.seed(2026112106)
# 층이 여러 개인 그래프: 이웃한 층 사이를 잇는 간선이 많아 경로 수가 매우 커진다
n, m = 200000, 200000
layers = 2000
size = n // layers  # 층마다 100개
edges = set()
def node(layer, k):
    return layer * size + k + 1
while len(edges) < m:
    l = random.randrange(layers - 1)
    a, b = node(l, random.randrange(size)), node(l + 1, random.randrange(size))
    edges.add((a, b))
# 1번과 N번이 반드시 이어지도록 층마다 한 줄 보장
for l in range(layers - 1):
    edges.add((node(l, 0), node(l + 1, 0)))
edges.add((node(layers - 2, 5), n))
edges = list(edges)[:m]
need = [(node(l, 0), node(l + 1, 0)) for l in range(layers - 1)]
es = set(edges)
for e in need:
    if e not in es:
        edges[random.randrange(m)] = e
random.shuffle(edges)
print(n, len(edges))
print("\n".join(f"{a} {b}" if random.random() < 0.5 else f"{b} {a}" for a, b in edges))
