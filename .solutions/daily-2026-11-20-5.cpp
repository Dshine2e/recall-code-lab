#include <bits/stdc++.h>
using namespace std;

int n;
int cnt[41];
vector<int> vals, path, best;
long long ways = 0;
bool sq(int s) { int r = (int)round(sqrt((double)s)); return r * r == s; }

void go() {
    if ((int)path.size() == n) {
        ways++;
        if (best.empty()) best = path;
        return;
    }
    for (int v : vals) {
        if (!cnt[v]) continue;
        if (!path.empty() && !sq(path.back() + v)) continue;
        cnt[v]--;
        path.push_back(v);
        go();
        path.pop_back();
        cnt[v]++;
    }
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) { int x; cin >> x; cnt[x]++; }
    for (int v = 1; v <= 20; v++) if (cnt[v]) vals.push_back(v);
    go();
    cout << ways << '\n';
    if (best.empty()) cout << -1 << '\n';
    else {
        for (int i = 0; i < n; i++) cout << best[i] << (i + 1 < n ? ' ' : '\n');
    }
    return 0;
}
