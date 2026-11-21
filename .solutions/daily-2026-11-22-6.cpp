#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<long long> as(n), ae(n), bs(m), be(m);
    for (int i = 0; i < n; i++) cin >> as[i] >> ae[i];
    for (int j = 0; j < m; j++) cin >> bs[j] >> be[j];
    int i = 0, j = 0; long long cnt = 0, total = 0, bl = -1, br = -1;
    while (i < n && j < m) {
        long long lo = max(as[i], bs[j]), hi = min(ae[i], be[j]);
        if (lo < hi) {
            cnt++; total += hi - lo;
            if (bl < 0 || hi - lo > br - bl) { bl = lo; br = hi; }
        }
        if (ae[i] < be[j]) i++; else j++;
    }
    cout << cnt << " " << total << "\n";
    if (bl < 0) cout << -1 << "\n"; else cout << bl << " " << br << "\n";
}
