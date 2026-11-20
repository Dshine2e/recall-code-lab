#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    // best[i] = 1..i 일에서 고른 최적 (최대 합, 최소 일수)
    vector<ll> s(n + 1);
    vector<int> c(n + 1);
    s[0] = 0; c[0] = 0;
    for (int i = 1; i <= n; i++) {
        ll s1 = s[i - 1]; int c1 = c[i - 1];
        ll s2 = (i >= 2 ? s[i - 2] : 0) + a[i]; int c2 = (i >= 2 ? c[i - 2] : 0) + 1;
        if (s2 > s1 || (s2 == s1 && c2 < c1)) { s[i] = s2; c[i] = c2; }
        else { s[i] = s1; c[i] = c1; }
    }
    cout << s[n] << ' ' << c[n] << '\n';
    return 0;
}
