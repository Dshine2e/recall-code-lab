import sys

def main():
    s = sys.stdin.readline().rstrip("\n").rstrip("\r")
    out = []
    for ch in s:
        if "a" <= ch <= "z":
            out.append(chr(ord("a") + ord("z") - ord(ch)))
        elif "A" <= ch <= "Z":
            out.append(chr(ord("A") + ord("Z") - ord(ch)))
        elif "0" <= ch <= "9":
            out.append(chr(ord("0") + ord("9") - ord(ch)))
        else:
            out.append(ch)
    print("".join(out))

main()
