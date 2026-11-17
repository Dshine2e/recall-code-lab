#include <bits/stdc++.h>
using namespace std;

int main() {
    long long len;
    int k;
    cin >> len >> k;
    vector<long long> p(k);
    for (auto &x : p) cin >> x;
    sort(p.begin(), p.end());
    p.insert(p.begin(), 0LL);
    p.push_back(len);
    int m = p.size();
    vector<vector<long long>> dp(m, vector<long long>(m, 0));
    for (int gap = 2; gap < m; gap++) {
        for (int i = 0; i + gap < m; i++) {
            int j = i + gap;
            long long best = LLONG_MAX;
            for (int t = i + 1; t < j; t++) best = min(best, dp[i][t] + dp[t][j]);
            dp[i][j] = best + p[j] - p[i];
        }
    }
    cout << dp[0][m - 1] << "\n";
    return 0;
}
