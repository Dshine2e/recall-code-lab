import random

# 최대 크기(R*C = 200,000) 뱀 모양 미로: 홀수 줄은 벽이고 한쪽 끝에만 통로가 있다.
# 비상구는 왼쪽 위 한 곳뿐이라 거리 합이 2^31 을 넘는다.
# 마지막 빈 줄은 입구를 막아 갈 수 없는 칸으로 만들고, 그 줄 안에 비상구 몇 개를 둔다.
random.seed(20261112)
R, C = 400, 500
rows = []
for i in range(R):
    if i % 2 == 0:
        rows.append(["."] * C)
    else:
        row = ["#"] * C
        if (i // 2) % 2 == 0:
            row[C - 1] = "."
        else:
            row[0] = "."
        rows.append(row)
rows[0][0] = "E"
last = R - 2
rows[last][C - 1] = "#"
rows[last][C // 2] = "#"
for _ in range(3):
    rows[last][random.randrange(C // 2 + 1, C - 1)] = "E"
print(R, C)
print("\n".join("".join(row) for row in rows))
