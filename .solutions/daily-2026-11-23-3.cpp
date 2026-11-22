#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    // 등차: 모든 이웃 차이가 같은가
    long long d = a[1] - a[0];
    bool ar = true;
    for (int i = 1; i < n; i++) if (a[i] - a[i - 1] != d) ar = false;
    // 등비: 0이 아닌 정수 r 이 존재하는가 (모든 후보 r 을 직접 확인)
    bool allZero = true;
    for (auto x : a) if (x != 0) allZero = false;
    bool ge = false; long long r = 0;
    if (allZero) { ge = true; r = 1; }
    else if (a[0] != 0) {
        for (long long c = -10000; c <= 10000 && !ge; c++) {
            if (c == 0) continue;
            bool ok = true;
            for (int i = 1; i < n && ok; i++) if (a[i - 1] * c != a[i]) ok = false;
            if (ok) { ge = true; r = c; }
        }
    }
    if (ar && ge) cout << "BOTH\n" << a[n - 1] + d << ' ' << a[n - 1] * r << '\n';
    else if (ar) cout << "ARITH\n" << a[n - 1] + d << '\n';
    else if (ge) cout << "GEO\n" << a[n - 1] * r << '\n';
    else cout << "NONE\n";
}
