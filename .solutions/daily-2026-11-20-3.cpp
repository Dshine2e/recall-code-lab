#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    while (n--) {
        long long x;
        cin >> x;
        long long s = 0;
        for (long long d = 1; d <= x - 1; d++)
            if (x % d == 0) s += d;
        const char *k = s == x ? "PERFECT" : (s < x ? "DEFICIENT" : "ABUNDANT");
        cout << s << ' ' << k << '\n';
    }
    return 0;
}
