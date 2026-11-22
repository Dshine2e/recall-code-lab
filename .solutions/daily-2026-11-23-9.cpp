#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<pair<long long, long long>> b(n);
    for (auto &p : b) {
        cin >> p.first >> p.second;
        if (p.first > p.second) swap(p.first, p.second);
    }
    sort(b.begin(), b.end(), [](const pair<long long,long long> &x, const pair<long long,long long> &y) {
        if (x.first != y.first) return x.first < y.first;
        return x.second > y.second;
    });
    vector<long long> t;
    for (auto &p : b) {
        auto it = lower_bound(t.begin(), t.end(), p.second);
        if (it == t.end()) t.push_back(p.second); else *it = p.second;
    }
    cout << t.size() << '\n';
}
