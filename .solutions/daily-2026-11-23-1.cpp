#include <bits/stdc++.h>
using namespace std;
int main() {
    long long h0; int n;
    cin >> h0 >> n;
    long long cur = h0, up = 0, down = 0, best = h0;
    int bestI = 0;
    for (int i = 1; i <= n; i++) {
        long long x; cin >> x;
        if (x > 0) up += x; else down += -x;
        cur += x;
        if (cur > best) { best = cur; bestI = i; }
    }
    cout << up << ' ' << down << '\n' << best << ' ' << bestI << '\n' << cur << '\n';
}
