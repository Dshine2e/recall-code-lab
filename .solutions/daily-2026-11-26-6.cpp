#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long L;
    int n;
    cin >> L >> n;
    vector<pair<long long, long long>> v(n);
    for (auto &p : v) cin >> p.first >> p.second;
    sort(v.begin(), v.end());
    long long curS = v[0].first, curE = v[0].second;
    long long cnt = 0, covered = 0, gap = curS;  // 0 부터 첫 덩어리까지
    for (int i = 1; i < n; i++) {
        if (v[i].first > curE) {
            cnt++;
            covered += curE - curS;
            gap = max(gap, v[i].first - curE);
            curS = v[i].first;
            curE = v[i].second;
        } else {
            curE = max(curE, v[i].second);
        }
    }
    cnt++;
    covered += curE - curS;
    gap = max(gap, L - curE);
    cout << cnt << '\n' << covered << '\n' << gap << '\n';
    return 0;
}
