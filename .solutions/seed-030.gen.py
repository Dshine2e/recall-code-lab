import random

random.seed(30)
N = 200000
letters = "abcdefghij"
words = []
for _ in range(N):
    length = random.randint(1, 10)
    words.append("".join(random.choice(letters) for _ in range(length)))
print(N)
print("\n".join(words))
