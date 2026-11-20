#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<ll> allSums(const vector<ll> &v) {
    int m = v.size();
    vector<ll> r(1 << m, 0);
    for (int mask = 1; mask < (1 << m); mask++) {
        int low = __builtin_ctz(mask);
        r[mask] = r[mask & (mask - 1)] + v[low];
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    ll B;
    cin >> n >> B;
    vector<ll> a(n);
    for (auto &x : a) cin >> x;
    vector<ll> L(a.begin(), a.begin() + n / 2), R(a.begin() + n / 2, a.end());
    vector<ll> sl = allSums(L), sr = allSums(R);
    sort(sr.begin(), sr.end());
    ll cnt = 0, best = 0;
    for (ll s : sl) {
        if (s > B) continue;
        // 이분 탐색: B - s 이하인 개수
        auto it = upper_bound(sr.begin(), sr.end(), B - s);
        ll k = it - sr.begin();
        cnt += k;
        if (k > 0) best = max(best, s + *(it - 1));
    }
    cout << cnt << '\n' << best << '\n';
    return 0;
}
