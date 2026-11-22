#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> a(n), b(n);
    for (auto &x : a) cin >> x;
    for (auto &x : b) cin >> x;
    // 차분 배열 D[0..n]: 늘어난 양의 합과 줄어든 양의 합은 같고, 그 값이 답이다
    long long up = 0, down = 0, prev = 0;
    for (int i = 0; i <= n; i++) {
        long long c = (i < n) ? b[i] - a[i] : 0;
        long long d = c - prev;
        if (d > 0) up += d; else down -= d;
        prev = c;
    }
    assert(up == down);
    cout << up << '\n';
}
