#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    vector<long long> v(n);
    for (auto &x : v) if (scanf("%lld", &x) != 1) return 0;
    // dp[l][r]: 구간 [l, r] 이 남았을 때부터의 최대 수익
    vector<vector<long long>> dp(n, vector<long long>(n, 0));
    for (int l = n - 1; l >= 0; l--) {
        for (int r = l; r < n; r++) {
            long long day = n - (r - l);
            if (l == r) { dp[l][r] = v[l] * day; continue; }
            dp[l][r] = max(v[l] * day + dp[l + 1][r], v[r] * day + dp[l][r - 1]);
        }
    }
    printf("%lld\n", dp[0][n - 1]);
    return 0;
}
