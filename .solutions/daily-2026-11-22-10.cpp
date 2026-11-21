#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int g, B; cin >> g >> B;
    const long long NEG = LLONG_MIN / 4;
    vector<long long> dp(B + 1, 0);
    for (int t = 0; t < g; t++) {
        int k; cin >> k;
        vector<long long> nd(B + 1, NEG);
        for (int j = 0; j < k; j++) {
            int c; long long v; cin >> c >> v;
            for (int b = c; b <= B; b++)
                if (dp[b - c] > NEG) nd[b] = max(nd[b], dp[b - c] + v);
        }
        dp = nd;
    }
    cout << (dp[B] > NEG ? dp[B] : -1) << "\n";
}
