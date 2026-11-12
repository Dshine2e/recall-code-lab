#include <bits/stdc++.h>
using namespace std;

int main() {
    int q;
    if (!(cin >> q)) return 0;
    while (q--) {
        long long x;
        cin >> x;
        int cnt = 0;
        for (long long d = 1; d * d <= x; d++) {
            if (x % d != 0) continue;
            cnt++;
            if (d != x / d) cnt++;
        }
        cout << cnt << ' ' << (cnt == 2 ? "YES" : "NO") << '\n';
    }
    return 0;
}
