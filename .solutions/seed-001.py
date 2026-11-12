import sys


def main():
    data = sys.stdin.read().split()
    r, c = int(data[0]), int(data[1])
    vals = list(map(int, data[2:2 + r * c]))
    grid = [vals[i * c:(i + 1) * c] for i in range(r)]
    found = []
    for i in range(r):
        for j in range(c):
            h = grid[i][j]
            ok = True
            for di, dj in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                ni, nj = i + di, j + dj
                # 음수 인덱스는 파이썬에서 반대편 끝을 가리키므로 범위를 직접 확인한다
                if 0 <= ni < r and 0 <= nj < c and grid[ni][nj] >= h:
                    ok = False
                    break
            if ok:
                found.append(f"{i + 1} {j + 1}")
    print(len(found))
    if found:
        print("\n".join(found))


main()
