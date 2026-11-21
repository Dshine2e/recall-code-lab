#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long W; cin >> n >> W;
    vector<long long> w(n);
    for (auto& x : w) cin >> x;
    int S = 1 << n;
    vector<pair<int,long long>> dp(S, {INT_MAX, 0});
    dp[0] = {1, 0};
    for (int m = 0; m < S; m++) {
        auto [t, l] = dp[m];
        for (int i = 0; i < n; i++) if (!(m >> i & 1)) {
            pair<int,long long> nx = (l + w[i] <= W) ? make_pair(t, l + w[i]) : make_pair(t + 1, w[i]);
            dp[m | 1 << i] = min(dp[m | 1 << i], nx);
        }
    }
    cout << dp[S - 1].first << "\n";
}
