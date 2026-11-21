import random
random.seed(2026112210)
G, B, K = 100, 10000, 500
print(G, B)
sizes = [5] * G
for gi in range(G):
    items = []
    for _ in range(sizes[gi]):
        items.append(f"{random.randint(50, 300)} {random.randint(0, 10**9)}")
    print(len(items), " ".join(items))
