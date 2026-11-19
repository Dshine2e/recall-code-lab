a = input().strip()
b = input().strip()
ca = [0] * 26
cb = [0] * 26
for ch in a:
    ca[ord(ch) - 97] += 1
for ch in b:
    cb[ord(ch) - 97] += 1
removed = 0
common = []
for i in range(26):
    removed += abs(ca[i] - cb[i])
    common.append(chr(97 + i) * min(ca[i], cb[i]))
rest = "".join(common)
print(removed)
print(rest if rest else "EMPTY")
