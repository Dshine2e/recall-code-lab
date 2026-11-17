a, b, k = map(int, input().split())
seq = [a, b]
while len(seq) < k:
    seq.append((seq[-1] + seq[-2]) % 1000)
seq = seq[:k]
print(seq[-1])
print(sum(seq))
