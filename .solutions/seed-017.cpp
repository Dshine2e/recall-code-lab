#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<long long> t(n + 1);
    for (int i = 1; i <= n; i++) cin >> t[i];
    vector<vector<int>> out(n + 1), in(n + 1);
    vector<int> deg(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        out[a].push_back(b);
        in[b].push_back(a);
        deg[b]++;
    }
    vector<int> topo;
    topo.reserve(n);
    queue<int> q;
    for (int v = 1; v <= n; v++)
        if (deg[v] == 0) q.push(v);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        topo.push_back(u);
        for (int v : out[u])
            if (--deg[v] == 0) q.push(v);
    }
    if ((int)topo.size() != n) {
        cout << -1 << '\n';
        return 0;
    }
    // 가장 이른 끝 시각(앞으로) / 가장 늦은 끝 시각(뒤로)
    vector<long long> ef(n + 1, 0), lf(n + 1, 0);
    for (int u : topo) {
        long long s = 0;
        for (int p : in[u]) s = max(s, ef[p]);
        ef[u] = s + t[u];
    }
    long long T = *max_element(ef.begin() + 1, ef.end());
    for (int i = n - 1; i >= 0; i--) {
        int u = topo[i];
        long long f = T;
        for (int v : out[u]) f = min(f, lf[v] - t[v]);
        lf[u] = f;
    }
    vector<int> crit;
    for (int v = 1; v <= n; v++)
        if (ef[v] == lf[v]) crit.push_back(v);
    cout << T << '\n' << crit.size() << '\n';
    for (size_t i = 0; i < crit.size(); i++) cout << crit[i] << (i + 1 < crit.size() ? ' ' : '\n');
    return 0;
}
