#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int H, W;
    cin >> H >> W;
    vector<string> g(H);
    int sr = 0, sc = 0, er = 0, ec = 0;
    for (int i = 0; i < H; i++) {
        cin >> g[i];
        for (int j = 0; j < W; j++) {
            if (g[i][j] == 'A') sr = i, sc = j;
            if (g[i][j] == 'B') er = i, ec = j;
        }
    }
    const int dr[4] = {-1, 0, 1, 0}, dc[4] = {0, 1, 0, -1};
    vector<int> best(H * W * 4, INT_MAX);
    deque<array<int, 4>> dq;  // {비용, 행, 열, 방향}
    for (int d = 0; d < 4; d++) {
        best[(sr * W + sc) * 4 + d] = 0;
        dq.push_back({0, sr, sc, d});
    }
    while (!dq.empty()) {
        auto [cost, r, c, d] = dq.front();
        dq.pop_front();
        if (cost > best[(r * W + c) * 4 + d]) continue;
        if (r == er && c == ec) {
            cout << cost << "\n";
            return 0;
        }
        int nr = r + dr[d], nc = c + dc[d];
        if (nr >= 0 && nr < H && nc >= 0 && nc < W && g[nr][nc] != '#') {
            int id = (nr * W + nc) * 4 + d;
            if (cost < best[id]) {
                best[id] = cost;
                dq.push_front({cost, nr, nc, d});
            }
        }
        int add = (g[r][c] == 'o') ? 0 : 1;
        for (int t : {1, 3}) {
            int nd = (d + t) % 4;
            int id = (r * W + c) * 4 + nd;
            if (cost + add < best[id]) {
                best[id] = cost + add;
                if (add == 0) dq.push_front({cost, r, c, nd});
                else dq.push_back({cost + 1, r, c, nd});
            }
        }
    }
    cout << -1 << "\n";
    return 0;
}
