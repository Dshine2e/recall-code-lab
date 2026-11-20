#include <bits/stdc++.h>
using namespace std;

vector<int> par, sz, ed;
int find(int x) {
    while (par[x] != x) x = par[x] = par[par[x]];
    return x;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    par.resize(n + 1);
    sz.assign(n + 1, 1);
    ed.assign(n + 1, 0);
    iota(par.begin(), par.end(), 0);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        int a = find(u), b = find(v);
        if (a == b) { ed[a]++; continue; }
        if (sz[a] < sz[b]) swap(a, b);
        par[b] = a;
        sz[a] += sz[b];
        ed[a] += ed[b] + 1;
    }
    int comps = 0, trees = 0, big = 0;
    for (int i = 1; i <= n; i++) if (find(i) == i) {
        comps++;
        if (ed[i] == sz[i] - 1) trees++;
        big = max(big, sz[i]);
    }
    cout << comps << ' ' << trees << ' ' << big << '\n';
    return 0;
}
