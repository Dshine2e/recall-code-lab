#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<long long, long long>> jobs(n);
    for (auto &j : jobs) cin >> j.second >> j.first;
    sort(jobs.begin(), jobs.end());
    long long now = 0, best = 0;
    for (auto &j : jobs) {
        now += j.second;
        best = max(best, now - j.first);
    }
    cout << best << '\n';
    return 0;
}
