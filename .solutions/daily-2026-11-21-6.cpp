#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const long long MOD = 1000000007LL;
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    vector<int> dist(n + 1, -1);
    vector<long long> cnt(n + 1, 0);
    vector<int> order;
    order.reserve(n);
    dist[1] = 0;
    cnt[1] = 1;
    order.push_back(1);
    for (size_t h = 0; h < order.size(); h++) {
        int u = order[h];
        for (int v : g[u]) {
            if (dist[v] < 0) {
                dist[v] = dist[u] + 1;
                order.push_back(v);
            }
            if (dist[v] == dist[u] + 1) cnt[v] = (cnt[v] + cnt[u]) % MOD;
        }
    }
    if (dist[n] < 0) cout << -1 << '\n';
    else cout << dist[n] << ' ' << cnt[n] << '\n';
    return 0;
}
