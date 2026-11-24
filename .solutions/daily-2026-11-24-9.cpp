#include <bits/stdc++.h>
using namespace std;

vector<int> par, sz;
int comps, biggest;

int findRoot(int x) {
    while (par[x] != x) {
        par[x] = par[par[x]];
        x = par[x];
    }
    return x;
}

void unite(int a, int b) {
    a = findRoot(a);
    b = findRoot(b);
    if (a == b) return;
    if (sz[a] < sz[b]) swap(a, b);
    par[b] = a;
    sz[a] += sz[b];
    comps--;
    biggest = max(biggest, sz[a]);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<int> u(m), v(m);
    for (int i = 0; i < m; i++) cin >> u[i] >> v[i];
    vector<int> ord(q);
    vector<char> gone(m, 0);
    for (auto &e : ord) {
        cin >> e;
        gone[e - 1] = 1;
    }
    par.resize(n + 1);
    sz.assign(n + 1, 1);
    iota(par.begin(), par.end(), 0);
    comps = n;
    biggest = 1;
    for (int i = 0; i < m; i++)
        if (!gone[i]) unite(u[i], v[i]);
    vector<pair<int, int>> ans(q);
    for (int j = q - 1; j >= 0; j--) {
        ans[j] = {comps, biggest};
        unite(u[ord[j] - 1], v[ord[j] - 1]);
    }
    string out;
    for (auto &p : ans) out += to_string(p.first) + " " + to_string(p.second) + "\n";
    cout << out;
    return 0;
}
