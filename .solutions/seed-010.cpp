#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    vector<pair<long long, long long>> v(n);  // (끝 + 정리 시간, 시작)
    for (int i = 0; i < n; i++) {
        long long s, e;
        cin >> s >> e;
        v[i] = {e + k, s};
    }
    sort(v.begin(), v.end());
    long long freeAt = LLONG_MIN;
    int cnt = 0;
    for (auto &p : v) {
        if (p.second >= freeAt) {
            cnt++;
            freeAt = p.first;
        }
    }
    cout << cnt << '\n';
    return 0;
}
