#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int n, LOG;
vector<vector<pair<int, int>>> adj;
vector<vector<int>> up;
vector<int> dep;
vector<ll> dist;

int lca(int a, int b) {
    if (dep[a] < dep[b]) swap(a, b);
    int diff = dep[a] - dep[b];
    for (int k = 0; k < LOG; k++)
        if (diff >> k & 1) a = up[k][a];
    if (a == b) return a;
    for (int k = LOG - 1; k >= 0; k--)
        if (up[k][a] != up[k][b]) a = up[k][a], b = up[k][b];
    return up[0][a];
}

ll d(int a, int b) { return dist[a] + dist[b] - 2 * dist[lca(a, b)]; }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n;
    adj.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        adj[a].push_back({b, w});
        adj[b].push_back({a, w});
    }
    LOG = 1;
    while ((1 << LOG) <= n) LOG++;
    up.assign(LOG, vector<int>(n + 1, 1));
    dep.assign(n + 1, 0);
    dist.assign(n + 1, 0);
    vector<bool> seen(n + 1, false);
    queue<int> q;
    q.push(1);
    seen[1] = true;
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (auto [to, w] : adj[v]) {
            if (seen[to]) continue;
            seen[to] = true;
            up[0][to] = v;
            dep[to] = dep[v] + 1;
            dist[to] = dist[v] + w;
            q.push(to);
        }
    }
    for (int k = 1; k < LOG; k++)
        for (int v = 1; v <= n; v++) up[k][v] = up[k - 1][up[k - 1][v]];
    int Q;
    cin >> Q;
    while (Q--) {
        int u, v, w;
        cin >> u >> v >> w;
        ll uw = d(u, w);
        if (uw + d(w, v) == d(u, v)) cout << uw << "\n";
        else cout << -1 << "\n";
    }
    return 0;
}
