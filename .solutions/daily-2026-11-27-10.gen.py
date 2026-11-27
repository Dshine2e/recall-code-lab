import random

random.seed(10271127)
N = 1000
a = "".join(random.choice("abcde") for _ in range(N))
b = "".join(random.choice("abcde") for _ in range(N))
print(a)
print(b)
