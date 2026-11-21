import random
random.seed(2026112207)
n = 200000
print(n)
# 앞 절반은 긴 사슬(깊은 트리), 뒤 절반은 무작위로 붙인다
perm = list(range(1, n + 1)); random.shuffle(perm)
lines = []
for i in range(1, n):
    if i < n // 2:
        par = perm[i - 1]
    else:
        par = perm[random.randrange(i)]
    lines.append(f"{par} {perm[i]} {random.choice([10**9, random.randint(1, 10**9)])}")
random.shuffle(lines)
print("\n".join(lines))
