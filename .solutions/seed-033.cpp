#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> p, sz;
    DSU(int n) : p(n), sz(n, 1) { iota(p.begin(), p.end(), 0); }
    int root(int x) {
        int r = x;
        while (p[r] != r) r = p[r];
        while (p[x] != r) { int nx = p[x]; p[x] = r; x = nx; }
        return r;
    }
    bool unite(int a, int b) {
        a = root(a); b = root(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        p[b] = a;
        sz[a] += sz[b];
        return true;
    }
};

int main() {
    int n, k, m;
    if (scanf("%d %d %d", &n, &k, &m) != 3) return 0;
    DSU dsu(n);
    int joined = 0;
    for (int i = 0; i < k; i++) {
        int a, b;
        scanf("%d %d", &a, &b);
        if (dsu.unite(a - 1, b - 1)) joined++;
    }
    vector<array<long long, 3>> e(m);
    for (int i = 0; i < m; i++) {
        long long u, v, w;
        scanf("%lld %lld %lld", &u, &v, &w);
        e[i] = {w, u - 1, v - 1};
    }
    sort(e.begin(), e.end());
    long long cost = 0, maxEdge = 0;
    for (auto &x : e) {
        if (joined == n - 1) break;
        if (dsu.unite((int)x[1], (int)x[2])) {
            joined++;
            cost += x[0];
            maxEdge = max(maxEdge, x[0]);
        }
    }
    if (joined != n - 1) {
        printf("-1\n");
    } else {
        printf("%lld\n%lld\n", cost, maxEdge);
    }
    return 0;
}
