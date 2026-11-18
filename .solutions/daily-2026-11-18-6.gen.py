import random

random.seed(2026111806)
h = w = 500
k = 37
print(h, w, k)
for _ in range(h):
    print("".join("#" if random.random() < 0.0004 else str(random.randint(0, 9)) for _ in range(w)))
