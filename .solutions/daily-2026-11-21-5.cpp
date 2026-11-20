#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> a(n);
    for (auto &p : a) cin >> p.first >> p.second;
    sort(a.begin(), a.end(), [](const pair<long long, long long> &x, const pair<long long, long long> &y) {
        return x.first * y.second < y.first * x.second;
    });
    long long now = 0, total = 0;
    for (auto &p : a) {
        now += p.first;
        total += now * p.second;
    }
    cout << total << '\n';
    return 0;
}
