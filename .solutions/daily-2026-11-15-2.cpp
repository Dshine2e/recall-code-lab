#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> v(n);
    for (auto &p : v) cin >> p.first >> p.second;
    sort(v.begin(), v.end());
    long long blocks = 0, total = 0, longest = 0;
    long long cs = v[0].first, ce = v[0].second;
    auto close = [&]() {
        blocks++;
        total += ce - cs;
        longest = max(longest, ce - cs);
    };
    for (int i = 1; i < n; i++) {
        if (v[i].first <= ce) {
            ce = max(ce, v[i].second);
        } else {
            close();
            cs = v[i].first;
            ce = v[i].second;
        }
    }
    close();
    cout << blocks << " " << total << " " << longest << "\n";
    return 0;
}
