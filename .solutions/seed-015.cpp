#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    for (auto& row : g) cin >> row;
    vector<vector<int>> d(r, vector<int>(c, -1));
    queue<pair<int, int>> q;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (g[i][j] == 'E') { d[i][j] = 0; q.push({i, j}); }
    const int dy[4] = {-1, 1, 0, 0}, dx[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [y, x] = q.front();
        q.pop();
        for (int k = 0; k < 4; k++) {
            int ny = y + dy[k], nx = x + dx[k];
            if (ny < 0 || ny >= r || nx < 0 || nx >= c) continue;
            if (g[ny][nx] == '#' || d[ny][nx] != -1) continue;
            d[ny][nx] = d[y][x] + 1;
            q.push({ny, nx});
        }
    }
    long long sum = 0;
    int bad = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (g[i][j] == '.') {
                if (d[i][j] < 0) bad++;
                else sum += d[i][j];
            }
    cout << sum << '\n' << bad << '\n';
    return 0;
}
