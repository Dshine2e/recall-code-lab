#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<long long> st(n);
    long long acc = 0;
    for (int i = 0; i < n; i++) { long long l; cin >> l; st[i] = acc; acc += l; }
    string out;
    while (q--) {
        long long t; cin >> t; t %= acc;
        int i = int(upper_bound(st.begin(), st.end(), t) - st.begin()) - 1;
        out += to_string(i + 1) + " " + to_string(t - st[i]) + "\n";
    }
    cout << out;
}
