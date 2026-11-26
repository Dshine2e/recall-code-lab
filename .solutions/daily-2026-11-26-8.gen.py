import random
random.seed(112608)
n = m = 200000
# 정점을 두 편으로 나누고 편 사이에만 간선을 놓아 끝까지 탐색하게 한다
side = [random.randint(0, 1) for _ in range(n + 1)]
left = [v for v in range(1, n + 1) if side[v] == 0]
right = [v for v in range(1, n + 1) if side[v] == 1]
edges = []
# 긴 사슬 하나(깊은 BFS)와 무작위 간선
chain = []
for i in range(min(len(left), len(right)) - 1):
    edges.append((left[i], right[i]))
    edges.append((right[i], left[i + 1]))
    if len(edges) >= m // 2:
        break
while len(edges) < m:
    edges.append((random.choice(left), random.choice(right)))
random.shuffle(edges)
print(n, m)
print("\n".join(f"{a} {b}" for a, b in edges))
