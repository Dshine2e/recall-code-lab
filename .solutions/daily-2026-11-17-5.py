import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
adj = [[] for _ in range(n + 1)]
for i in range(n - 1):
    u, v = int(data[1 + 2 * i]), int(data[2 + 2 * i])
    adj[u].append(v)
    adj[v].append(u)
parent = [0] * (n + 1)
depth = [0] * (n + 1)
order = [1]
parent[1] = -1
stack = [1]
while stack:
    u = stack.pop()
    for v in adj[u]:
        if v != parent[u]:
            parent[v] = u
            depth[v] = depth[u] + 1
            order.append(v)
            stack.append(v)
size = [1] * (n + 1)
for u in reversed(order):
    if parent[u] > 0:
        size[parent[u]] += size[u]
sys.stdout.write("\n".join(f"{depth[i]} {size[i]}" for i in range(1, n + 1)) + "\n")
