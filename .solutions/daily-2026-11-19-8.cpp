#include <bits/stdc++.h>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    for (auto& row : g) cin >> row;
    int sy = 0, sx = 0, ey = 0, ex = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) {
            if (g[i][j] == 'S') sy = i, sx = j;
            if (g[i][j] == 'E') ey = i, ex = j;
        }
    vector<vector<int>> dist(r, vector<int>(c, -1));
    int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};
    int dx[8] = {2, 1, -1, -2, -2, -1, 1, 2};
    queue<pair<int, int>> q;
    dist[sy][sx] = 0;
    q.push({sy, sx});
    while (!q.empty()) {
        auto [y, x] = q.front();
        q.pop();
        for (int k = 0; k < 8; k++) {
            int ny = y + dy[k], nx = x + dx[k];
            if (ny < 0 || ny >= r || nx < 0 || nx >= c) continue;
            if (g[ny][nx] == '#' || dist[ny][nx] != -1) continue;
            dist[ny][nx] = dist[y][x] + 1;
            q.push({ny, nx});
        }
    }
    cout << dist[ey][ex] << "\n";
    return 0;
}
