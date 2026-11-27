import sys

MOD = 1_000_000_007


def main():
    s = sys.stdin.readline().strip()
    total = 0
    sign = 1
    term = 1
    num = 0
    for ch in s:
        if "0" <= ch <= "9":
            num = num * 10 + (ord(ch) - 48)
        else:
            term = term * (num % MOD) % MOD
            num = 0
            if ch != "*":
                total = (total + sign * term) % MOD
                term = 1
                sign = 1 if ch == "+" else -1
    term = term * (num % MOD) % MOD
    total = (total + sign * term) % MOD
    print(total % MOD)


main()
