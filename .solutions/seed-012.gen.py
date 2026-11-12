import random

random.seed(2026111212)
n, q = 200000, 200000
out = [f"{n} {q}"]
out.append(" ".join(str(random.randint(1, 10**9)) for _ in range(n)))
for i in range(q):
    if i < 100000:
        # 앞부분은 긴 사슬 모양으로 합쳐 경로 압축이 없으면 느려지게 한다
        if i % 2 == 0:
            a = i // 2 + 1
            out.append(f"1 {a + 1} {a}")
        else:
            out.append(f"3 {random.randint(1, n)}")
    else:
        r = random.random()
        a, b = random.randint(1, n), random.randint(1, n)
        if r < 0.4:
            out.append(f"1 {a} {b}")
        elif r < 0.7:
            out.append(f"2 {a} {b}")
        else:
            out.append(f"3 {a}")
print("\n".join(out))
