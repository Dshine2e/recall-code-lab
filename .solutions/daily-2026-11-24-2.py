s = input().strip()
n = len(s)
best = s[0]
for i in range(n):
    for j in range(i + 1, n + 1):
        part = s[i:j]
        if len(part) > len(best) and part == part[::-1]:
            best = part
print(len(best))
print(best)
