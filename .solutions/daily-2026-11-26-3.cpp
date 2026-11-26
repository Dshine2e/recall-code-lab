#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int primes = 0, best = -1, bestCnt = -1;
    for (int x = a; x <= b; x++) {
        int cnt = 0;
        for (int d = 1; d <= x; d++)
            if (x % d == 0) cnt++;
        bool isPrime = (x >= 2);
        for (int d = 2; d * d <= x; d++)
            if (x % d == 0) { isPrime = false; break; }
        if (isPrime) primes++;
        if (cnt > bestCnt) { bestCnt = cnt; best = x; }
    }
    cout << primes << '\n' << best << ' ' << bestCnt << '\n';
    return 0;
}
