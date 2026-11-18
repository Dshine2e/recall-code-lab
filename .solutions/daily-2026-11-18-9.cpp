#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<long long> g(n + 1);
    for (int i = 1; i <= n; i++) cin >> g[i];
    vector<vector<long long>> dist(n + 1, vector<long long>(n + 1, INF));
    for (int i = 1; i <= n; i++) dist[i][i] = 0;
    for (int e = 0; e < m; e++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        dist[u][v] = min(dist[u][v], w);
        dist[v][u] = min(dist[v][u], w);
    }
    // 위험도 오름차순으로 경유 도시를 하나씩 허용하며, 그때마다의 거리표를 저장한다
    vector<int> ord(n);
    iota(ord.begin(), ord.end(), 1);
    sort(ord.begin(), ord.end(), [&](int a, int b) { return g[a] < g[b]; });
    vector<long long> th;  // th[t] = t 개 허용했을 때 마지막으로 허용된 위험도
    vector<vector<vector<long long>>> snap;
    snap.push_back(dist);
    for (int t = 0; t < n; t++) {
        int k = ord[t];
        for (int i = 1; i <= n; i++) {
            if (dist[i][k] >= INF) continue;
            for (int j = 1; j <= n; j++)
                if (dist[k][j] < INF && dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
        }
        snap.push_back(dist);
        th.push_back(g[k]);
    }
    int q;
    cin >> q;
    string out;
    while (q--) {
        int a, b;
        long long x;
        cin >> a >> b >> x;
        int cnt = upper_bound(th.begin(), th.end(), x) - th.begin();
        long long r = snap[cnt][a][b];
        out += to_string(r >= INF ? -1 : r);
        out += '\n';
    }
    cout << out;
    return 0;
}
