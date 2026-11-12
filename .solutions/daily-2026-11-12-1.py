import sys

def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    s = data[1][:n]
    out = []
    i = 0
    while i < n:
        j = i
        while j < n and s[j] == s[i]:
            j += 1
        run = j - i
        out.append(s[i] if run == 1 else s[i] + str(run))
        i = j
    print("".join(out))

main()
