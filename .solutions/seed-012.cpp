#include <bits/stdc++.h>
using namespace std;

vector<int> par, sz;
vector<long long> sales;

int findRoot(int x) {
    int r = x;
    while (par[r] != r) r = par[r];
    while (par[x] != r) {
        int nx = par[x];
        par[x] = r;
        x = nx;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    par.resize(n + 1);
    sz.assign(n + 1, 1);
    sales.assign(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        par[i] = i;
        cin >> sales[i];
    }
    string out;
    for (int i = 0; i < q; i++) {
        int t;
        cin >> t;
        if (t == 1) {
            int a, b;
            cin >> a >> b;
            a = findRoot(a);
            b = findRoot(b);
            if (a == b) continue;
            if (sz[a] < sz[b]) swap(a, b);
            par[b] = a;
            sz[a] += sz[b];
            sales[a] += sales[b];
        } else if (t == 2) {
            int a, b;
            cin >> a >> b;
            out += (findRoot(a) == findRoot(b)) ? "YES\n" : "NO\n";
        } else {
            int a;
            cin >> a;
            out += to_string(sales[findRoot(a)]) + "\n";
        }
    }
    cout << out;
    return 0;
}
