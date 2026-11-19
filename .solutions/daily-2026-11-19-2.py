s = input().strip()
items = []
name, num = "", ""
for ch in s:
    if ch.isdigit():
        num += ch
    else:
        if num:
            items.append((name, int(num)))
            name, num = "", ""
        name += ch
items.append((name, int(num)))
total = sum(q for _, q in items)
best = items[0]
for it in items:
    if it[1] > best[1]:
        best = it
print(len(items), total)
print(best[0], best[1])
