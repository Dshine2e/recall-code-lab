#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    // 2차 차분: 두 번 누적하면 c, 2c, ..., len*c 가 된다
    vector<long long> d(n + 3, 0);
    while (q--) {
        long long l, r, c;
        cin >> l >> r >> c;
        long long len = r - l + 1;
        d[l] += c;
        d[r + 1] -= c * (len + 1);
        d[r + 2] += c * len;
    }
    long long step = 0, val = 0;
    string out;
    for (int i = 1; i <= n; i++) {
        step += d[i];
        val += step;
        out += to_string(val);
        out += (i < n ? ' ' : '\n');
    }
    cout << out;
    return 0;
}
