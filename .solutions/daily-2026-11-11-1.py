y, m = map(int, input().split())
leap = y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)
if m == 2:
    print(29 if leap else 28)
elif m in (4, 6, 9, 11):
    print(30)
else:
    print(31)
