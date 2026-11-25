#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    for (auto& s : g) cin >> s;
    const int INF = INT_MAX;
    vector<vector<int>> smoke(r, vector<int>(c, INF)), dist(r, vector<int>(c, -1));
    queue<pair<int, int>> q;
    int sr = 0, sc = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) {
            if (g[i][j] == '*') { smoke[i][j] = 0; q.push({i, j}); }
            if (g[i][j] == 'S') { sr = i; sc = j; }
        }
    int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [i, j] = q.front(); q.pop();
        for (int k = 0; k < 4; k++) {
            int ni = i + dr[k], nj = j + dc[k];
            if (ni < 0 || nj < 0 || ni >= r || nj >= c || g[ni][nj] == '#' || smoke[ni][nj] != INF) continue;
            smoke[ni][nj] = smoke[i][j] + 1;
            q.push({ni, nj});
        }
    }
    dist[sr][sc] = 0;
    q.push({sr, sc});
    while (!q.empty()) {
        auto [i, j] = q.front(); q.pop();
        if (g[i][j] == 'E') { cout << dist[i][j] << "\n"; return 0; }
        for (int k = 0; k < 4; k++) {
            int ni = i + dr[k], nj = j + dc[k];
            if (ni < 0 || nj < 0 || ni >= r || nj >= c || g[ni][nj] == '#' || dist[ni][nj] != -1) continue;
            int t = dist[i][j] + 1;
            if (smoke[ni][nj] <= t) continue;
            dist[ni][nj] = t;
            q.push({ni, nj});
        }
    }
    cout << -1 << "\n";
    return 0;
}
