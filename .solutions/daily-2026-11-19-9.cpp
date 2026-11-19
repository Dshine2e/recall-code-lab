#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int n;
vector<ll> mx, lz;
vector<int> cnt;

void pull(int k) {
    int a = 2 * k, b = 2 * k + 1;
    if (mx[a] > mx[b]) mx[k] = mx[a], cnt[k] = cnt[a];
    else if (mx[a] < mx[b]) mx[k] = mx[b], cnt[k] = cnt[b];
    else mx[k] = mx[a], cnt[k] = cnt[a] + cnt[b];
}

void build(int k, int s, int e, const vector<ll>& h) {
    if (s == e) { mx[k] = h[s]; cnt[k] = 1; return; }
    int m = (s + e) / 2;
    build(2 * k, s, m, h);
    build(2 * k + 1, m + 1, e, h);
    pull(k);
}

void apply_add(int k, ll x) { mx[k] += x; lz[k] += x; }

void push(int k) {
    if (lz[k]) {
        apply_add(2 * k, lz[k]);
        apply_add(2 * k + 1, lz[k]);
        lz[k] = 0;
    }
}

void update(int k, int s, int e, int l, int r, ll x) {
    if (r < s || e < l) return;
    if (l <= s && e <= r) { apply_add(k, x); return; }
    push(k);
    int m = (s + e) / 2;
    update(2 * k, s, m, l, r, x);
    update(2 * k + 1, m + 1, e, l, r, x);
    pull(k);
}

pair<ll, int> query(int k, int s, int e, int l, int r) {
    if (r < s || e < l) return {LLONG_MIN, 0};
    if (l <= s && e <= r) return {mx[k], cnt[k]};
    push(k);
    int m = (s + e) / 2;
    auto a = query(2 * k, s, m, l, r);
    auto b = query(2 * k + 1, m + 1, e, l, r);
    if (a.first > b.first) return a;
    if (a.first < b.first) return b;
    return {a.first, a.second + b.second};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> n >> q;
    vector<ll> h(n);
    for (auto& x : h) cin >> x;
    mx.assign(4 * n, 0);
    lz.assign(4 * n, 0);
    cnt.assign(4 * n, 0);
    build(1, 0, n - 1, h);
    while (q--) {
        int t, l, r;
        cin >> t >> l >> r;
        if (t == 1) {
            ll x;
            cin >> x;
            update(1, 0, n - 1, l - 1, r - 1, x);
        } else {
            auto res = query(1, 0, n - 1, l - 1, r - 1);
            cout << res.first << " " << res.second << "\n";
        }
    }
    return 0;
}
