#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> a(n);
    for (auto& s : a) cin >> s;
    if (a[0][0] != '1') { cout << -1 << '\n'; return 0; }
    vector<vector<int>> dist(n, vector<int>(m, 0));
    dist[0][0] = 1;
    queue<pair<int, int>> q;
    q.push({0, 0});
    const int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx >= 0 && nx < n && ny >= 0 && ny < m && a[nx][ny] == '1' && !dist[nx][ny]) {
                dist[nx][ny] = dist[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    cout << (dist[n - 1][m - 1] ? dist[n - 1][m - 1] : -1) << '\n';
}
