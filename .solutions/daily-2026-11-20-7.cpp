#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    string s;
    cin >> n >> s;
    vector<ll> keys;
    keys.reserve(n + 1);
    const ll OFF = 300000, W = 1000000;
    ll x = 0, y = 0;
    keys.push_back((x + OFF) * W + (y + OFF));
    unordered_set<ll> st;
    st.reserve(2 * n + 10);
    st.insert(keys[0]);
    int fk = -1; ll fx = 0, fy = 0;
    for (int k = 0; k < n; k++) {
        char c = s[k];
        if (c == 'U') y++;
        else if (c == 'D') y--;
        else if (c == 'L') x--;
        else x++;
        ll key = (x + OFF) * W + (y + OFF);
        if (!st.insert(key).second && fk < 0) { fk = k + 1; fx = x; fy = y; }
    }
    if (fk < 0) cout << -1 << '\n';
    else cout << fk << ' ' << fx << ' ' << fy << '\n';
    cout << st.size() << '\n';
    return 0;
}
