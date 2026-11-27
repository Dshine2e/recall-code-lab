#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> c(n + 1);
    for (int i = 1; i <= n; i++) cin >> c[i];
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    const long long INF = LLONG_MAX / 4;
    vector<int> par(n + 1, 0), ord;
    ord.reserve(n);
    vector<int> st = {1};
    par[1] = -1;
    while (!st.empty()) {
        int v = st.back();
        st.pop_back();
        ord.push_back(v);
        for (int w : g[v])
            if (w != par[v]) {
                par[w] = v;
                st.push_back(w);
            }
    }
    // dp[v][0]: v에 설치, [1]: 미설치·자식이 덮음, [2]: 미설치·아직 안 덮임(부모 필요)
    vector<array<long long, 3>> dp(n + 1);
    for (int k = n - 1; k >= 0; k--) {
        int v = ord[k];
        long long a = c[v], base = 0, fix = INF;
        int kids = 0;
        for (int w : g[v]) {
            if (w == par[v]) continue;
            kids++;
            a += min({dp[w][0], dp[w][1], dp[w][2]});
            long long m = min(dp[w][0], dp[w][1]);
            base += m;
            fix = min(fix, dp[w][0] - m);
        }
        dp[v][0] = a;
        dp[v][2] = base;
        dp[v][1] = kids ? base + fix : INF;
    }
    cout << min(dp[1][0], dp[1][1]) << '\n';
    return 0;
}
