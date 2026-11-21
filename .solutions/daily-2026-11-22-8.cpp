#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> a(n), pre(n + 1, 0), suf(n + 2, 0);
    for (auto& x : a) cin >> x;
    for (int i = 0; i < n; i++) pre[i + 1] = __gcd(pre[i], a[i]);
    for (int i = n - 1; i >= 0; i--) suf[i] = __gcd(suf[i + 1], a[i]);
    long long best = -1; int idx = -1;
    for (int i = 0; i < n; i++) {
        long long g = __gcd(pre[i], suf[i + 1]);
        if (g > best) { best = g; idx = i + 1; }
    }
    cout << best << " " << idx << "\n";
}
