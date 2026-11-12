#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long W;
    cin >> n >> W;
    vector<long long> wt(n);
    vector<int> val(n);
    int sumV = 0;
    for (int i = 0; i < n; i++) {
        cin >> wt[i] >> val[i];
        sumV += val[i];
    }
    const long long INF = LLONG_MAX / 4;
    vector<long long> dp(sumV + 1, INF);
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        for (int x = sumV; x >= val[i]; x--) {
            if (dp[x - val[i]] + wt[i] < dp[x]) dp[x] = dp[x - val[i]] + wt[i];
        }
    }
    int ans = 0;
    for (int x = 0; x <= sumV; x++) {
        if (dp[x] <= W) ans = x;
    }
    cout << ans << '\n';
    return 0;
}
