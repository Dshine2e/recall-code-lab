#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto& x : a) cin >> x;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x; cin >> x;
        int lo = 0, hi = n - 1, found = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == x) { found = mid + 1; break; }
            if (a[mid] < x) lo = mid + 1; else hi = mid - 1;
        }
        cout << (i ? " " : "") << found;
    }
    cout << '\n';
}
