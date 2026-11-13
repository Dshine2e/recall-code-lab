import sys

lines = sys.stdin.read().split("\n")
k = int(lines[0]) % 26
s = lines[1].rstrip("\r")
res = []
for ch in s:
    if "a" <= ch <= "z":
        res.append(chr((ord(ch) - ord("a") + k) % 26 + ord("a")))
    elif "A" <= ch <= "Z":
        res.append(chr((ord(ch) - ord("A") + k) % 26 + ord("A")))
    else:
        res.append(ch)
print("".join(res))
