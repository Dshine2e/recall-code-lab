#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n;
    vector<array<long long, 4>> r(n);
    vector<long long> xs, ys;
    for (auto &t : r) {
        cin >> t[0] >> t[1] >> t[2] >> t[3];
        xs.push_back(t[0]); xs.push_back(t[2]);
        ys.push_back(t[1]); ys.push_back(t[3]);
    }
    sort(xs.begin(), xs.end()); xs.erase(unique(xs.begin(), xs.end()), xs.end());
    sort(ys.begin(), ys.end()); ys.erase(unique(ys.begin(), ys.end()), ys.end());
    int w = xs.size(), h = ys.size();
    auto ix = [&](long long v) { return int(lower_bound(xs.begin(), xs.end(), v) - xs.begin()); };
    auto iy = [&](long long v) { return int(lower_bound(ys.begin(), ys.end(), v) - ys.begin()); };
    vector<vector<int>> cnt(w, vector<int>(h, 0));
    for (auto &t : r) {
        int a = ix(t[0]), b = iy(t[1]), c = ix(t[2]), e = iy(t[3]);
        cnt[a][b]++; cnt[c][b]--; cnt[a][e]--; cnt[c][e]++;
    }
    for (int i = 0; i < w; i++)
        for (int j = 0; j < h; j++) {
            if (i) cnt[i][j] += cnt[i - 1][j];
            if (j) cnt[i][j] += cnt[i][j - 1];
            if (i && j) cnt[i][j] -= cnt[i - 1][j - 1];
        }
    long long uni = 0, once = 0;
    for (int i = 0; i + 1 < w; i++)
        for (int j = 0; j + 1 < h; j++) {
            long long area = (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]);
            if (cnt[i][j] > 0) uni += area;
            if (cnt[i][j] == 1) once += area;
        }
    cout << uni << "\n" << once << "\n";
    return 0;
}
