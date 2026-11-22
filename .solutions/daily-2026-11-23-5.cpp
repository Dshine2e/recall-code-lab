#include <bits/stdc++.h>
using namespace std;
int n, m, q;
vector<vector<long long>> P;
long long rect(int r1, int c1, int r2, int c2) {
    return P[r2][c2] - P[r1 - 1][c2] - P[r2][c1 - 1] + P[r1 - 1][c1 - 1];
}
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n >> m >> q;
    P.assign(n + 1, vector<long long>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            long long x; cin >> x;
            P[i][j] = x + P[i - 1][j] + P[i][j - 1] - P[i - 1][j - 1];
        }
    string out;
    while (q--) {
        int r1, c1, r2, c2, t; cin >> r1 >> c1 >> r2 >> c2 >> t;
        long long s = rect(r1, c1, r2, c2);
        int a = r1 + t, b = c1 + t, c = r2 - t, d = c2 - t;
        if (a <= c && b <= d) s -= rect(a, b, c, d);
        out += to_string(s); out += '\n';
    }
    cout << out;
}
