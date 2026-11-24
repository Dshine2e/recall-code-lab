#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> t(n);
    for (auto &x : t) cin >> x;
    vector<int> cnt(m + 1, 0);
    int kinds = 0, l = 0, bestLen = INT_MAX, bestStart = -1;
    for (int r = 0; r < n; r++) {
        if (cnt[t[r]]++ == 0) kinds++;
        // 왼쪽 끝 값이 구간 안에 또 있으면 줄여도 종류가 그대로
        while (cnt[t[l]] > 1) {
            cnt[t[l]]--;
            l++;
        }
        if (kinds == m && r - l + 1 < bestLen) {
            bestLen = r - l + 1;
            bestStart = l;
        }
    }
    if (bestStart < 0) cout << -1 << "\n";
    else cout << bestLen << " " << bestStart + 1 << "\n";
    return 0;
}
