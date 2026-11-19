import random

random.seed(2026111908)
r, c = 500, 500
g = [["#" if random.random() < 0.25 else "." for _ in range(c)] for _ in range(r)]
g[0][0] = "S"
g[r - 1][c - 1] = "E"
print(r, c)
print("\n".join("".join(row) for row in g))
