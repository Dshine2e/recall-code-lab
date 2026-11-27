#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> s(n);
    for (auto& x : s) cin >> x;
    sort(s.begin(), s.end());
    string out;
    for (int i = 0; i < q; i++) {
        long long p;
        cin >> p;
        // p 보다 큰 첫 위치(upper_bound) 기준으로 왼쪽: p 이하 최대, 오른쪽: p 초과 최소
        auto it = upper_bound(s.begin(), s.end(), p);
        long long bestPos = 0, bestDist = LLONG_MAX;
        if (it != s.begin()) {
            long long v = *prev(it);
            bestPos = v;
            bestDist = p - v;
        }
        if (it != s.end()) {
            long long v = *it;
            if (v - p < bestDist) {
                bestDist = v - p;
                bestPos = v;
            }
        }
        out += to_string(bestPos) + ' ' + to_string(bestDist) + '\n';
    }
    cout << out;
    return 0;
}
