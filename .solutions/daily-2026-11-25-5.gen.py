import random
random.seed(112505)
n = 200000
m = 200000
edges = []
# 크기가 제각각인 묶음을 만들고 묶음 안에서만 잇는다(일부 정점은 혼자 남는다)
order = list(range(1, n + 1))
random.shuffle(order)
groups = []
i = 0
while i < n:
    k = random.choice([1, 1, 2, 5, 50, 3000])
    groups.append(order[i:i + k])
    i += k
for g in groups:
    for j in range(1, len(g)):
        edges.append((g[j], g[random.randrange(j)]))
while len(edges) < m:
    g = random.choice(groups)
    if len(g) >= 2:
        a, b = random.sample(g, 2)
        edges.append((a, b))
edges = edges[:m]
random.shuffle(edges)
out = [f"{n} {m}"] + [f"{a} {b}" for a, b in edges]
print("\n".join(out))
