import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    scores = list(map(int, data[1:1 + n]))
    distinct = sorted(set(scores), reverse=True)
    grade = {s: i + 1 for i, s in enumerate(distinct)}
    sys.stdout.write(" ".join(str(grade[s]) for s in scores) + "\n")


main()
