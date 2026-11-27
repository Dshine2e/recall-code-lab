#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long d;
    cin >> n >> d;
    vector<long long> a(n);
    for (auto& x : a) cin >> x;
    sort(a.begin(), a.end());
    long long ans = 0;
    for (int i = 0; i < n; i++) {
        // a[i] - d 이상인 첫 위치
        int j = lower_bound(a.begin(), a.begin() + i, a[i] - d) - a.begin();
        ans += i - j;
    }
    cout << ans << '\n';
    return 0;
}
