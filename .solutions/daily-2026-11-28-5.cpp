#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m, q;
    if (scanf("%d %d %d", &n, &m, &q) != 3) return 0;
    vector<vector<long long>> P(n + 1, vector<long long>(m + 1, 0));
    for (int r = 1; r <= n; r++) {
        for (int c = 1; c <= m; c++) {
            long long v;
            if (scanf("%lld", &v) != 1) return 0;
            long long s = ((r + c) % 2 == 0) ? v : -v;
            P[r][c] = s + P[r - 1][c] + P[r][c - 1] - P[r - 1][c - 1];
        }
    }
    string out;
    while (q--) {
        int r1, c1, r2, c2;
        if (scanf("%d %d %d %d", &r1, &c1, &r2, &c2) != 4) return 0;
        long long ans = P[r2][c2] - P[r1 - 1][c2] - P[r2][c1 - 1] + P[r1 - 1][c1 - 1];
        out += to_string(ans);
        out += '\n';
    }
    fputs(out.c_str(), stdout);
    return 0;
}
