#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll MOD = 1000000007LL;

ll power(ll b, ll e) {
    ll r = 1;
    b %= MOD;
    while (e) {
        if (e & 1) r = r * b % MOD;
        b = b * b % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int h, w, k;
    cin >> h >> w >> k;
    vector<pair<int, int>> p(k);
    for (auto &q : p) cin >> q.first >> q.second;
    int m = h + w;
    vector<ll> fa(m + 1), iv(m + 1);
    fa[0] = 1;
    for (int i = 1; i <= m; i++) fa[i] = fa[i - 1] * i % MOD;
    for (int i = 0; i <= m; i++) iv[i] = power(fa[i], MOD - 2);
    auto C = [&](int n, int r) -> ll {
        if (r < 0 || r > n) return 0;
        return fa[n] * iv[r] % MOD * iv[n - r] % MOD;
    };
    // 끝점을 넣고, (행+열) 합 기준으로 정렬
    p.push_back({h, w});
    sort(p.begin(), p.end(), [](const pair<int,int> &a, const pair<int,int> &b) {
        return a.first + a.second < b.first + b.second;
    });
    int t = p.size();
    vector<ll> g(t);
    for (int i = 0; i < t; i++) {
        ll v = C(p[i].first + p[i].second - 2, p[i].first - 1);
        for (int j = 0; j < i; j++) {
            int dr = p[i].first - p[j].first, dc = p[i].second - p[j].second;
            if (dr < 0 || dc < 0) continue;
            v = (v - g[j] * C(dr + dc, dr)) % MOD;
        }
        g[i] = (v + MOD) % MOD;
    }
    // 끝점은 행+열 합이 가장 커서 마지막에 온다
    cout << g[t - 1] << '\n';
    return 0;
}
