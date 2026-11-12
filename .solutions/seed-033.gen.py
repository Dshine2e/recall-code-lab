import random

random.seed(33)
N = 100000
K = 100000
M = 200000
lines = ["%d %d %d" % (N, K, M)]
for _ in range(K):
    a = random.randint(1, N)
    b = random.randint(1, N - 1)
    if b >= a:
        b += 1
    lines.append("%d %d" % (a, b))
# 모든 건물이 이어질 수 있도록 후보 배관에 무작위 신장 트리를 먼저 넣는다.
label = list(range(1, N + 1))
random.shuffle(label)
edges = []
for i in range(1, N):
    j = random.randrange(i)
    edges.append((label[i], label[j], random.randint(1, 1000000000)))
while len(edges) < M:
    a = random.randint(1, N)
    b = random.randint(1, N - 1)
    if b >= a:
        b += 1
    edges.append((a, b, random.randint(1, 1000000000)))
random.shuffle(edges)
for u, v, w in edges:
    lines.append("%d %d %d" % (u, v, w))
print("\n".join(lines))
