#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    const long long NEG = LLONG_MIN / 4;
    vector<vector<long long>> g(n, vector<long long>(m));
    for (auto &r : g)
        for (auto &x : r) cin >> x;
    vector<vector<array<long long, 2>>> dp(n, vector<array<long long, 2>>(m, {NEG, NEG}));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            long long v = g[i][j];
            if (i == 0 && j == 0) {
                dp[0][0] = {v, 0};
                continue;
            }
            long long p0 = NEG, p1 = NEG;
            if (i > 0) {
                p0 = max(p0, dp[i - 1][j][0]);
                p1 = max(p1, dp[i - 1][j][1]);
            }
            if (j > 0) {
                p0 = max(p0, dp[i][j - 1][0]);
                p1 = max(p1, dp[i][j - 1][1]);
            }
            dp[i][j][0] = p0 + v;
            dp[i][j][1] = max(p1 + v, p0);
        }
    }
    cout << max(dp[n - 1][m - 1][0], dp[n - 1][m - 1][1]) << "\n";
    return 0;
}
