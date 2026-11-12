#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, ll>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v; ll w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    const ll INF = LLONG_MAX / 4;
    // 상태 번호 = 섬 * 2 + (통행권 사용 여부)
    vector<ll> dist(2 * (n + 1), INF);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    dist[1 * 2 + 0] = 0;
    pq.push({0, 1 * 2 + 0});
    while (!pq.empty()) {
        auto [d, st] = pq.top(); pq.pop();
        if (d != dist[st]) continue;
        int u = st / 2, used = st % 2;
        for (auto [v, w] : adj[u]) {
            int keep = v * 2 + used;
            if (d + w < dist[keep]) { dist[keep] = d + w; pq.push({dist[keep], keep}); }
            if (!used) {
                int fr = v * 2 + 1;
                if (d < dist[fr]) { dist[fr] = d; pq.push({d, fr}); }
            }
        }
    }
    ll ans = min(dist[n * 2], dist[n * 2 + 1]);
    cout << (ans >= INF ? -1 : ans) << '\n';
}
