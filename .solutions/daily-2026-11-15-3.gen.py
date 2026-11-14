import random

random.seed(2026111503)
a = "".join(random.choice("abcde") for _ in range(1000))
b = "".join(random.choice("abcde") for _ in range(1000))
print(1000, 999, 1000)
print(a)
print(b)
