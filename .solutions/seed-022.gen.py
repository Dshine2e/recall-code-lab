import random

random.seed(2026111222)
# 팀 수가 가장 많아지는 N = 12, K = 6 에 사이 나쁜 쌍을 조금 섞는다
n, k = 12, 6
pairs = [(a, b) for a in range(1, n + 1) for b in range(a + 1, n + 1)]
chosen = random.sample(pairs, 5)
lines = [f"{n} {k} {len(chosen)}"]
for a, b in chosen:
    if random.random() < 0.5:
        a, b = b, a
    lines.append(f"{a} {b}")
print("\n".join(lines))
