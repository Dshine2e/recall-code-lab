import sys

def main():
    data = sys.stdin.read().split("\n")
    q = int(data[0])
    text = []
    undo = []  # (종류, 글자)
    redo = []
    for line in data[1:q + 1]:
        parts = line.split()
        cmd = parts[0]
        if cmd == "ADD":
            text.append(parts[1])
            undo.append(("A", parts[1]))
            redo.clear()
        elif cmd == "DEL":
            if text:
                c = text.pop()
                undo.append(("D", c))
                redo.clear()
        elif cmd == "UNDO":
            if undo:
                kind, c = undo.pop()
                if kind == "A":
                    text.pop()
                else:
                    text.append(c)
                redo.append((kind, c))
        else:  # REDO
            if redo:
                kind, c = redo.pop()
                if kind == "A":
                    text.append(c)
                else:
                    text.pop()
                undo.append((kind, c))
    print("".join(text) if text else "EMPTY")

main()
