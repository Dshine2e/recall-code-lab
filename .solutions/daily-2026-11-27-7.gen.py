import random

random.seed(7271127)
N = Q = 200_000
L = 10**9
s = [random.randint(-L, L) for _ in range(N)]
q = [random.randint(-L, L) if i % 3 else random.choice(s) + random.choice([-1, 0, 1]) for i in range(Q)]
q = [max(-L, min(L, x)) for x in q]
print(N, Q)
print(" ".join(map(str, s)))
print(" ".join(map(str, q)))
