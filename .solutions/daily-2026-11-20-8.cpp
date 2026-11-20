#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll countSame(vector<ll> v) {
    sort(v.begin(), v.end());
    ll res = 0;
    size_t i = 0;
    while (i < v.size()) {
        size_t j = i;
        while (j < v.size() && v[j] == v[i]) j++;
        ll c = j - i;
        res += c * (c - 1) / 2;
        i = j;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<ll> u(n), d(n);
    for (int i = 1; i <= n; i++) {
        ll a;
        cin >> a;
        u[i - 1] = a - i;
        d[i - 1] = a + i;
    }
    cout << countSame(u) << ' ' << countSame(d) << '\n';
    return 0;
}
