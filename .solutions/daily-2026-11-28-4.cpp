#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    scanf("%d", &n);
    vector<int> a(n);
    int mx = 0;
    for (auto &x : a) { scanf("%d", &x); mx = max(mx, x); }
    vector<int> cnt(mx + 1, 0), res(mx + 1, 0);
    for (int x : a) cnt[x]++;
    for (int v = 1; v <= mx; v++) {
        if (!cnt[v]) continue;
        for (int m = v; m <= mx; m += v) res[m] += cnt[v];
    }
    string out;
    for (int i = 0; i < n; i++) {
        if (i) out += ' ';
        out += to_string(res[a[i]] - 1);
    }
    puts(out.c_str());
    return 0;
}
