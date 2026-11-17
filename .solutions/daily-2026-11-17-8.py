import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
people = []
for i in range(n):
    name = data[1 + 3 * i].decode()
    s, p = int(data[2 + 3 * i]), int(data[3 + 3 * i])
    people.append((-s, p, name))
people.sort()
out = []
rank = 0
for i, (ns, p, name) in enumerate(people):
    if i == 0 or (ns, p) != people[i - 1][:2]:
        rank = i + 1
    out.append(f"{rank} {name}")
sys.stdout.write("\n".join(out) + "\n")
