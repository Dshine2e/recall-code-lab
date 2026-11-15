#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<int> w(n);
    for (auto &x : w) cin >> x;
    sort(w.begin(), w.end());
    string out;
    while (q--) {
        int l, r;
        cin >> l >> r;
        long cnt = upper_bound(w.begin(), w.end(), r) - lower_bound(w.begin(), w.end(), l);
        out += to_string(cnt);
        out += '\n';
    }
    cout << out;
    return 0;
}
