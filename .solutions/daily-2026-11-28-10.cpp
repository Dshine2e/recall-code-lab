#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &row : g) cin >> row;
    // dp[s][a][b]: s 걸음 뒤 첫째가 a행, 둘째가 b행
    vector<vector<vector<int>>> dp(n + m - 1, vector<vector<int>>(n, vector<int>(n, -1)));
    auto cell = [&](int r, int c) -> int { return g[r][c] == '#' ? -1 : g[r][c] - '0'; };
    dp[0][0][0] = cell(0, 0);
    for (int s = 1; s <= n + m - 2; s++) {
        for (int a = 0; a < n; a++) {
            int ca = s - a;
            if (ca < 0 || ca >= m || cell(a, ca) < 0) continue;
            for (int b = 0; b < n; b++) {
                int cb = s - b;
                if (cb < 0 || cb >= m || cell(b, cb) < 0) continue;
                int best = -1;
                for (int da = 0; da <= 1; da++)
                    for (int db = 0; db <= 1; db++) {
                        int pa = a - da, pb = b - db;
                        if (pa < 0 || pb < 0) continue;
                        best = max(best, dp[s - 1][pa][pb]);
                    }
                if (best < 0) continue;
                int gain = cell(a, ca) + (a != b ? cell(b, cb) : 0);
                dp[s][a][b] = best + gain;
            }
        }
    }
    cout << dp[n + m - 2][n - 1][n - 1] << "\n";
    return 0;
}
