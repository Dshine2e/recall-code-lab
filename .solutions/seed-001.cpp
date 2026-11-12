#include <bits/stdc++.h>
using namespace std;

int main() {
    int r, c;
    if (!(cin >> r >> c)) return 0;
    vector<vector<int>> g(r + 2, vector<int>(c + 2, -1));  // 바깥 테두리는 -1(높이 0보다 낮음)
    for (int i = 1; i <= r; i++)
        for (int j = 1; j <= c; j++) cin >> g[i][j];
    vector<pair<int, int>> peaks;
    for (int i = 1; i <= r; i++) {
        for (int j = 1; j <= c; j++) {
            int h = g[i][j];
            if (g[i - 1][j] < h && g[i + 1][j] < h && g[i][j - 1] < h && g[i][j + 1] < h)
                peaks.push_back({i, j});
        }
    }
    printf("%d\n", (int)peaks.size());
    for (auto &p : peaks) printf("%d %d\n", p.first, p.second);
    return 0;
}
