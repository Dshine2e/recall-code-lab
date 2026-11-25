SPECIAL = set('!@#$%^&*')
t = int(input())
for _ in range(t):
    s = input().strip()
    bad = []
    if not 8 <= len(s) <= 16:
        bad.append(1)
    kinds = 0
    kinds += any(c.isupper() for c in s)
    kinds += any(c.islower() for c in s)
    kinds += any(c.isdigit() for c in s)
    kinds += any(c in SPECIAL for c in s)
    if kinds < 3:
        bad.append(2)
    if any(s[i] == s[i + 1] == s[i + 2] for i in range(len(s) - 2)):
        bad.append(3)
    run = False
    for i in range(len(s) - 2):
        a, b, c = s[i], s[i + 1], s[i + 2]
        if a.isdigit() and b.isdigit() and c.isdigit() and int(b) == int(a) + 1 and int(c) == int(b) + 1:
            run = True
    if run:
        bad.append(4)
    print('OK' if not bad else ' '.join(map(str, bad)))
