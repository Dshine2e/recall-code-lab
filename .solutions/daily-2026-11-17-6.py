import sys

data = sys.stdin.buffer.read().split()
q = int(data[0])
xs = list(map(int, data[1:1 + q]))
m = max(xs)
spf = list(range(m + 1))
i = 2
while i * i <= m:
    if spf[i] == i:
        for j in range(i * i, m + 1, i):
            if spf[j] == j:
                spf[j] = i
    i += 1
out = []
for x in xs:
    divs = 1
    big = 0
    while x > 1:
        p = spf[x]
        e = 0
        while x % p == 0:
            x //= p
            e += 1
        divs *= e + 1
        big = p
    out.append(f"{big} {divs}")
sys.stdout.write("\n".join(out) + "\n")
