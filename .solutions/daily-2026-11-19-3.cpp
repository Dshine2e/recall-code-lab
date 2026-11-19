#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    long long k;
    cin >> n >> m >> k;
    vector<vector<int>> g(n, vector<int>(m));
    for (auto& row : g)
        for (auto& x : row) cin >> x;
    for (int t = 0; t < k % 4; t++) {
        int r = g.size(), c = g[0].size();
        vector<vector<int>> h(c, vector<int>(r));
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++) h[j][r - 1 - i] = g[i][j];
        g = h;
    }
    cout << g.size() << " " << g[0].size() << "\n";
    for (auto& row : g) {
        for (int j = 0; j < (int)row.size(); j++) cout << (j ? " " : "") << row[j];
        cout << "\n";
    }
    return 0;
}
