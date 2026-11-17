#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    vector<int> par(n + 1, 0), dep(n + 1, 0), sz(n + 1, 1), order;
    order.reserve(n);
    queue<int> q;
    q.push(1);
    par[1] = 0;
    vector<bool> seen(n + 1, false);
    seen[1] = true;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : g[u]) {
            if (!seen[v]) {
                seen[v] = true;
                par[v] = u;
                dep[v] = dep[u] + 1;
                q.push(v);
            }
        }
    }
    for (int i = n - 1; i >= 1; i--) sz[par[order[i]]] += sz[order[i]];
    for (int i = 1; i <= n; i++) cout << dep[i] << " " << sz[i] << "\n";
    return 0;
}
