#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, int>> ev;
    ev.reserve(2 * n);
    for (int i = 0; i < n; i++) {
        long long s, e;
        cin >> s >> e;
        ev.push_back({s, 1});
        ev.push_back({e, -1});
    }
    sort(ev.begin(), ev.end());
    int cur = 0, best = 0;
    long long bestT = 0;
    for (auto &[t, d] : ev) {
        cur += d;
        if (cur > best) {
            best = cur;
            bestT = t;
        }
    }
    cout << best << ' ' << bestT << '\n';
    return 0;
}
