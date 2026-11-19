import random

random.seed(2026111904)
q = 200000
print(q)
out = []
for _ in range(q):
    r = random.random()
    if r < 0.45:
        out.append("ADD " + chr(97 + random.randrange(26)))
    elif r < 0.6:
        out.append("DEL")
    elif r < 0.8:
        out.append("UNDO")
    else:
        out.append("REDO")
print("\n".join(out))
