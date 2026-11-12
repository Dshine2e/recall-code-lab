#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n);
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        g[u].push_back(v); g[v].push_back(u);
    }
    vector<bool> seen(n, false);
    int count = 0;
    for (int r = 0; r < n; r++) {
        if (seen[r]) continue;
        count++;
        seen[r] = true;
        vector<int> st{r};
        while (!st.empty()) {
            int u = st.back(); st.pop_back();
            for (int v : g[u]) if (!seen[v]) { seen[v] = true; st.push_back(v); }
        }
    }
    cout << count << '\n';
}
