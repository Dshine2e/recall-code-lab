#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    vector<int> indeg(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);
        indeg[b]++;
    }
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int v = 1; v <= n; v++) if (indeg[v] == 0) pq.push(v);
    vector<int> order;
    bool unique = true;
    while (!pq.empty()) {
        if (pq.size() > 1) unique = false;
        int v = pq.top(); pq.pop();
        order.push_back(v);
        for (int w : adj[v]) if (--indeg[w] == 0) pq.push(w);
    }
    if ((int)order.size() < n) { cout << -1 << "\n"; return 0; }
    string out;
    for (int i = 0; i < n; i++) { out += to_string(order[i]); out += (i + 1 < n ? ' ' : '\n'); }
    cout << out << (unique ? "유일" : "여러 개") << "\n";
    return 0;
}
