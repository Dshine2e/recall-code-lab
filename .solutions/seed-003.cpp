#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<long long>> S(n + 1, vector<long long>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            long long v;
            cin >> v;
            S[i][j] = v + S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1];
        }
    }
    int q;
    cin >> q;
    string out;
    out.reserve((size_t)q * 16);
    while (q--) {
        int r, c, k;
        cin >> r >> c >> k;
        int top = max(1, r - k), bottom = min(n, r + k);
        int left = max(1, c - k), right = min(m, c + k);
        long long sum = S[bottom][right] - S[top - 1][right] - S[bottom][left - 1] + S[top - 1][left - 1];
        out += to_string(sum);
        out += '\n';
    }
    cout << out;
    return 0;
}
