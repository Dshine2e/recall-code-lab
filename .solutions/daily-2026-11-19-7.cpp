#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<pair<long long, int>> ev;
    ev.reserve(2 * n);
    for (int i = 0; i < n; i++) {
        long long l, r;
        cin >> l >> r;
        ev.push_back({l, +1});
        ev.push_back({r, -1});
    }
    sort(ev.begin(), ev.end());
    long long total = 0;
    int cur = 0;
    for (size_t i = 0; i < ev.size(); i++) {
        if (i > 0 && cur == k) total += ev[i].first - ev[i - 1].first;
        cur += ev[i].second;
    }
    cout << total << "\n";
    return 0;
}
