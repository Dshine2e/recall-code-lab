#include <bits/stdc++.h>
using namespace std;

int main() {
    int I, D, R;
    string a, b;
    cin >> I >> D >> R >> a >> b;
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 0; i <= n; i++) dp[i][0] = i * D;
    for (int j = 0; j <= m; j++) dp[0][j] = j * I;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            int c = dp[i - 1][j - 1] + (a[i - 1] == b[j - 1] ? 0 : R);
            c = min(c, dp[i - 1][j] + D);
            c = min(c, dp[i][j - 1] + I);
            dp[i][j] = c;
        }
    }
    cout << dp[n][m] << "\n";
    return 0;
}
