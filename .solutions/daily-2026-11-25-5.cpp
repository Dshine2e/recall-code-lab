#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    vector<int> comp(n + 1, -1);
    vector<long long> sz;
    for (int s = 1; s <= n; s++) {
        if (comp[s] != -1) continue;
        int id = sz.size();
        sz.push_back(0);
        queue<int> q;
        q.push(s);
        comp[s] = id;
        while (!q.empty()) {
            int x = q.front(); q.pop();
            sz[id]++;
            for (int y : adj[x]) if (comp[y] == -1) { comp[y] = id; q.push(y); }
        }
    }
    // 앞에서부터 누적 크기와 곱해 서로 다른 요소 쌍을 센다
    long long acc = 0, pairs = 0;
    for (long long s : sz) { pairs += acc * s; acc += s; }
    cout << sz.size() << " " << pairs << "\n";
    return 0;
}
