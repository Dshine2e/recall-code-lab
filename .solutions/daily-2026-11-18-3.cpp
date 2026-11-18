#include <bits/stdc++.h>
using namespace std;

long long rev(long long v) {
    long long r = 0;
    while (v > 0) {
        r = r * 10 + v % 10;
        v /= 10;
    }
    return r;
}

int main() {
    long long n;
    int k;
    cin >> n >> k;
    long long x = n;
    for (int s = 0; s <= k; s++) {
        if (rev(x) == x) {
            cout << s << " " << x << "\n";
            return 0;
        }
        if (s < k) x += rev(x);
    }
    cout << -1 << "\n";
    return 0;
}
