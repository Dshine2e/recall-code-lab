#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int R, C;
    cin >> R >> C;
    vector<string> g(R);
    for (auto &row : g) cin >> row;
    vector<vector<char>> vis(R, vector<char>(C, 0));
    const int dr[4] = {-1, 1, 0, 0};
    const int dc[4] = {0, 0, -1, 1};
    int groups = 0, largest = 0;
    vector<pair<int, int>> st;
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) {
            if (g[i][j] != '#' || vis[i][j]) continue;
            groups++;
            int cells = 0;
            vis[i][j] = 1;
            st.push_back({i, j});
            while (!st.empty()) {
                auto [y, x] = st.back();
                st.pop_back();
                cells++;
                for (int d = 0; d < 4; d++) {
                    int ny = y + dr[d], nx = x + dc[d];
                    if (ny < 0 || ny >= R || nx < 0 || nx >= C) continue;
                    if (g[ny][nx] != '#' || vis[ny][nx]) continue;
                    vis[ny][nx] = 1;
                    st.push_back({ny, nx});
                }
            }
            largest = max(largest, cells);
        }
    }
    cout << groups << ' ' << largest << '\n';
    return 0;
}
