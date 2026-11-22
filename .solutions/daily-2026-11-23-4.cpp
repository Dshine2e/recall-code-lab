#include <bits/stdc++.h>
using namespace std;
struct B { string name; long long v, s, c; };
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<B> b(n);
    for (auto &x : b) cin >> x.name >> x.v >> x.s >> x.c;
    sort(b.begin(), b.end(), [](const B &x, const B &y) {
        long long l = x.s * y.c, r = y.s * x.c;
        if (l != r) return l > r;
        if (x.v != y.v) return x.v > y.v;
        return x.name < y.name;
    });
    string out;
    for (auto &x : b) { out += x.name; out += '\n'; }
    cout << out;
}
