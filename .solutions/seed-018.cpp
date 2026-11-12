#include <bits/stdc++.h>
using namespace std;

struct Fenwick {
    int n;
    vector<long long> t;
    explicit Fenwick(int n) : n(n), t(n + 1, 0) {}
    void add(int i, long long v) {
        for (; i <= n; i += i & -i) t[i] += v;
    }
    long long sum(int i) const {
        long long s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    // 차분 d[i] 에 대해 prefix(k) = (k+1) * sum d[i] - sum i*d[i]
    Fenwick d(n), id(n);
    vector<long long> a(n + 2, 0);
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) {
        long long diff = a[i] - a[i - 1];
        d.add(i, diff);
        id.add(i, diff * i);
    }
    auto prefix = [&](int k) -> long long {
        return (long long)(k + 1) * d.sum(k) - id.sum(k);
    };
    string out;
    for (int qi = 0; qi < q; qi++) {
        int type;
        cin >> type;
        if (type == 1) {
            int l, r;
            long long x;
            cin >> l >> r >> x;
            d.add(l, x);
            id.add(l, x * l);
            if (r + 1 <= n) {
                d.add(r + 1, -x);
                id.add(r + 1, -x * (r + 1));
            }
        } else {
            int l, r;
            cin >> l >> r;
            out += to_string(prefix(r) - prefix(l - 1));
            out += '\n';
        }
    }
    cout << out;
    return 0;
}
