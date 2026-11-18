#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int H, W, K;
    cin >> H >> W >> K;
    vector<vector<int>> P(H + 1, vector<int>(W + 1, 0)), R(H + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= H; i++) {
        string row;
        cin >> row;
        for (int j = 1; j <= W; j++) {
            char c = row[j - 1];
            int val = (c == '#') ? 0 : c - '0';
            int rock = (c == '#') ? 1 : 0;
            P[i][j] = P[i - 1][j] + P[i][j - 1] - P[i - 1][j - 1] + val;
            R[i][j] = R[i - 1][j] + R[i][j - 1] - R[i - 1][j - 1] + rock;
        }
    }
    auto box = [&](vector<vector<int>> &A, int r1, int c1, int r2, int c2) {
        return A[r2][c2] - A[r1 - 1][c2] - A[r2][c1 - 1] + A[r1 - 1][c1 - 1];
    };
    int best = -1, bestR = 0, bestC = 0;
    for (int top = 1; top + K - 1 <= H; top++)
        for (int left = 1; left + K - 1 <= W; left++) {
            if (box(R, top, left, top + K - 1, left + K - 1) > 0) continue;
            int v = box(P, top, left, top + K - 1, left + K - 1);
            if (v > best) best = v, bestR = top, bestC = left;
        }
    if (best < 0) cout << -1 << "\n";
    else cout << best << " " << bestR << " " << bestC << "\n";
    return 0;
}
