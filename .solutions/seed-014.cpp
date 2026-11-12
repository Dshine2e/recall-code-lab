#include <bits/stdc++.h>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    for (auto& row : g) cin >> row;
    int k;
    string cmd;
    cin >> k >> cmd;
    int y = 0, x = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (g[i][j] == 'S') { y = i; x = j; }
    vector<vector<bool>> vis(r, vector<bool>(c, false));
    vis[y][x] = true;
    int cnt = 1;
    for (char ch : cmd) {
        int ny = y, nx = x;
        if (ch == 'U') ny--;
        else if (ch == 'D') ny++;
        else if (ch == 'L') nx--;
        else nx++;
        if (ny < 0 || ny >= r || nx < 0 || nx >= c) continue;
        if (g[ny][nx] == '#') continue;
        y = ny; x = nx;
        if (!vis[y][x]) { vis[y][x] = true; cnt++; }
    }
    cout << y + 1 << ' ' << x + 1 << '\n' << cnt << '\n';
    return 0;
}
