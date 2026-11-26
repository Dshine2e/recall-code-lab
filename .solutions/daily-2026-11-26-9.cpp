#include <bits/stdc++.h>
using namespace std;

int n, k;
vector<long long> a;

bool feasible(long long x) {
    vector<int> pre(n + 1, 0);
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + (a[i] >= x ? 1 : -1);
    int best = INT_MAX;
    for (int r = k; r <= n; r++) {
        best = min(best, pre[r - k]);
        if (pre[r] - best >= 1) return true;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> k;
    a.resize(n);
    for (auto &x : a) cin >> x;
    long long lo = 1, hi = 1000000000;  // 답은 [lo, hi] 안의 실제 값
    while (lo < hi) {
        long long mid = lo + (hi - lo + 1) / 2;
        if (feasible(mid)) lo = mid;
        else hi = mid - 1;
    }
    cout << lo << '\n';
    return 0;
}
