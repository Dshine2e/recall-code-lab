s = input()
cnt = [0] * 26
for ch in s:
    if ch.isalpha():
        cnt[ord(ch.lower()) - ord('a')] += 1
missing = ''.join(chr(ord('a') + i) for i in range(26) if cnt[i] == 0)
print(missing if missing else '없음')
best = 0
for i in range(26):
    if cnt[i] > cnt[best]:
        best = i
print(chr(ord('a') + best), cnt[best])
