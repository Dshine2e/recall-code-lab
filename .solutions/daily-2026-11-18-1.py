import sys


def main():
    data = sys.stdin.read().split()
    n, day = int(data[0]), data[1]
    total = 0
    pos = 2
    for _ in range(n):
        age, member = int(data[pos]), data[pos + 1]
        pos += 2
        if age <= 3:
            price = 0
        elif age >= 65:
            price = 5000
        elif age <= 12:
            price = 10000 if day == "WEEKEND" else 8000
        else:
            price = 20000 if day == "WEEKEND" else 15000
        if member == "Y":
            price = price * 8 // 10
        total += price
    print(total)


main()
