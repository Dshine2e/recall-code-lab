#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (auto& x : a) cin >> x;
    // 좌표를 0..n-1 로 바꿔 배열로 센다
    vector<int> s = a;
    sort(s.begin(), s.end());
    s.erase(unique(s.begin(), s.end()), s.end());
    for (auto& x : a) x = lower_bound(s.begin(), s.end(), x) - s.begin();
    vector<int> cnt(s.size(), 0);
    int kinds = 0, best = -1, start = 0;
    for (int i = 0; i < n; i++) {
        if (cnt[a[i]]++ == 0) kinds++;
        if (i >= k && --cnt[a[i - k]] == 0) kinds--;
        if (i >= k - 1 && kinds > best) {
            best = kinds;
            start = i - k + 2;
        }
    }
    cout << best << " " << start << "\n";
    return 0;
}
