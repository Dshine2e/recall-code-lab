#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    string s; cin >> s;
    // 알파벳별 개수 누적 (26 × (n+1))
    vector<array<int, 26>> cnt(n + 1);
    cnt[0].fill(0);
    for (int i = 1; i <= n; i++) { cnt[i] = cnt[i - 1]; cnt[i][s[i - 1] - 'a']++; }
    string out;
    while (q--) {
        int l, r; cin >> l >> r;
        int odd = 0;
        for (int k = 0; k < 26; k++) if ((cnt[r][k] - cnt[l - 1][k]) % 2) odd++;
        out += to_string(odd / 2); out += '\n';
    }
    cout << out;
}
