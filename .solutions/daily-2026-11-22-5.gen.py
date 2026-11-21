import random
random.seed(2026112205)
n = 200000
print(n)
print("".join(random.choice("RL") if i % 3 else "R" for i in range(n)))
