#include <bits/stdc++.h>
using namespace std;
int n;
vector<vector<pair<int,long long>>> adj;
pair<int,long long> far_(int s) {
    vector<long long> d(n + 1, -1); d[s] = 0;
    vector<int> st = {s};
    while (!st.empty()) {
        int x = st.back(); st.pop_back();
        for (auto [y, w] : adj[x]) if (d[y] < 0) { d[y] = d[x] + w; st.push_back(y); }
    }
    int b = 1;
    for (int i = 1; i <= n; i++) if (d[i] > d[b]) b = i;
    return {b, d[b]};
}
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n; adj.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) { int u, v; long long w; cin >> u >> v >> w; adj[u].push_back({v, w}); adj[v].push_back({u, w}); }
    int a = far_(1).first;
    cout << far_(a).second << "\n";
}
