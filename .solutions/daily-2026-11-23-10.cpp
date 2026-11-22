#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = LLONG_MAX / 4;
int n, m;
vector<vector<pair<int, ll>>> g;
vector<ll> run(int src) {
    vector<ll> d(n + 1, INF);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<pair<ll, int>>> pq;
    d[src] = 0; pq.push({0, src});
    while (!pq.empty()) {
        auto [du, u] = pq.top(); pq.pop();
        if (du != d[u]) continue;
        for (auto [v, w] : g[u]) if (du + w < d[v]) { d[v] = du + w; pq.push({d[v], v}); }
    }
    return d;
}
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int s, t; cin >> n >> m >> s >> t;
    g.assign(n + 1, {});
    vector<array<ll, 3>> e(m);
    for (auto &x : e) {
        cin >> x[0] >> x[1] >> x[2];
        g[x[0]].push_back({(int)x[1], x[2]});
        g[x[1]].push_back({(int)x[0], x[2]});
    }
    vector<ll> a = run(s);
    if (a[t] >= INF) { cout << -1 << '\n'; return 0; }
    vector<ll> b = run(t);
    ll D = a[t];
    vector<int> on;
    for (int i = 0; i < m; i++) {
        ll u = e[i][0], v = e[i][1], w = e[i][2];
        bool ok = (a[u] < INF && b[v] < INF && a[u] + w + b[v] == D) ||
                  (a[v] < INF && b[u] < INF && a[v] + w + b[u] == D);
        if (ok) on.push_back(i + 1);
    }
    cout << D << ' ' << on.size() << '\n';
    for (size_t i = 0; i < on.size(); i++) cout << (i ? " " : "") << on[i];
    cout << '\n';
}
